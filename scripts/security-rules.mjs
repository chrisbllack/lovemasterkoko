#!/usr/bin/env node
/**
 * Project-specific security rules for CI.
 *
 * Catches common credential and code leak mistakes:
 *  - secrets read via import.meta.env instead of server-side process.env
 *  - hardcoded credentials committed to source
 *
 * Exit code 1 fails the pipeline.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, extname } from "node:path";

const ROOT = process.cwd();
const findings = [];

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (["node_modules", ".git", "dist", "build", ".tanstack", ".output"].includes(entry)) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const files = walk(ROOT);
const rel = (f) => relative(ROOT, f);

const isServerOnly = (f) => /\.server\.(ts|tsx|js|mjs)$/.test(f) || rel(f).startsWith("scripts/");

const report = (level, file, line, message) =>
  findings.push({ level, file: rel(file), line, message });

// ---------------------------------------------------------------- source rules
const sourceFiles = files.filter(
  (f) => [".ts", ".tsx", ".js", ".jsx", ".mjs"].includes(extname(f)) && rel(f).startsWith("src/"),
);

for (const file of sourceFiles) {
  const text = readFileSync(file, "utf8");
  const lines = text.split("\n");
  const serverOnly = isServerOnly(file);

  lines.forEach((line, i) => {
    const n = i + 1;
    const code = line.replace(/\/\/.*$/, "");

    // 1. Secrets must not be exposed through client-visible env.
    if (/import\.meta\.env\.[A-Za-z_]*(SECRET|PRIVATE|_KEY\b)/.test(code)) {
      const isPublishable = /PUBLIC|PUBLISHABLE|VITE_PAYSTACK_PUBLIC_KEY|KEY/.test(code);
      if (!isPublishable) {
        report(
          "error",
          file,
          n,
          "Secret read from import.meta.env (shipped to the browser). Read it from process.env inside a server handler.",
        );
      }
    }

    // 2. process.env at module scope in a client-reachable file.
    if (!serverOnly && /process\.env\./.test(code) && !/\.functions\.(ts|tsx)$/.test(file)) {
      report(
        "warn",
        file,
        n,
        "process.env used in client-reachable code; it is undefined in the browser.",
      );
    }

    // 3. Hardcoded credentials.
    if (/(eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,})|sk_live_[A-Za-z0-9]{10,}/.test(code)) {
      report("error", file, n, "Hardcoded credential/token literal found in source.");
    }

    // 4. Dangerous sinks.
    if (/dangerouslySetInnerHTML/.test(code)) {
      report(
        "warn",
        file,
        n,
        "dangerouslySetInnerHTML — confirm the value is sanitized or trusted CMS content.",
      );
    }
    if (/\beval\(|new Function\(/.test(code)) {
      report("error", file, n, "eval()/new Function() is not allowed.");
    }
  });
}

// ---------------------------------------------------------------------- output
const errors = findings.filter((f) => f.level === "error");
const warnings = findings.filter((f) => f.level === "warn");

for (const f of [...errors, ...warnings]) {
  const icon = f.level === "error" ? "✖" : "⚠";
  console.log(`${icon} ${f.file}:${f.line}  ${f.message}`);
}

console.log(
  `\nScanned ${sourceFiles.length} source files — ${errors.length} error(s), ${warnings.length} warning(s).`,
);

if (errors.length > 0) {
  console.error("\nSecurity rules failed. Fix the errors above before deploying.");
  process.exit(1);
}

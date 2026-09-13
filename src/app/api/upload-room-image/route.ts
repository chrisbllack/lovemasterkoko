import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const singleFile = formData.get("file") as File | null;
    const slug = (formData.get("slug") as string | null) || "deluxe";

    const allFiles: File[] = [];
    if (files && files.length > 0) {
      allFiles.push(...files.filter(Boolean));
    } else if (singleFile) {
      allFiles.push(singleFile);
    }

    if (allFiles.length === 0) {
      return NextResponse.json({ error: "No image files provided" }, { status: 400 });
    }

    const imagesDir = path.join(process.cwd(), "public", "images");
    await fs.mkdir(imagesDir, { recursive: true });

    const savedUrls: string[] = [];

    for (let i = 0; i < allFiles.length; i++) {
      const file = allFiles[i];
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Clean up filename or use standard slot
      const originalName = file.name || `photo-${i + 1}.jpeg`;
      const ext = path.extname(originalName) || ".jpeg";

      // 1. Save with exact original filename in public/images
      const targetPath = path.join(imagesDir, originalName);
      await fs.writeFile(targetPath, buffer);
      savedUrls.push(`/images/${originalName}`);

      // 2. Also map to standard names for Deluxe if applicable
      if (slug === "deluxe" || originalName.toUpperCase().includes("DELUXE")) {
        const standardName = `DELUXE MAIN${i + 1}.jpeg`;
        await fs.writeFile(path.join(imagesDir, standardName), buffer);

        // First uploaded image also updates primary deluxe.jpg
        if (i === 0) {
          await fs.writeFile(path.join(imagesDir, "deluxe.jpg"), buffer);
          await fs.writeFile(path.join(imagesDir, "deluxe-main-1.jpg"), buffer);
        } else if (i === 1) {
          await fs.writeFile(path.join(imagesDir, "deluxe-main-2.jpg"), buffer);
        }
      }

      // 3. Map to standard names for Executive if applicable
      if (slug === "executive" || originalName.toUpperCase().includes("EXECUTIVE")) {
        if (i === 0) {
          await fs.writeFile(path.join(imagesDir, "EXECUTIVE Main.jpeg"), buffer);
          await fs.writeFile(path.join(imagesDir, "executive.jpg"), buffer);
        } else if (i === 1) {
          await fs.writeFile(path.join(imagesDir, "EXECUTIVE MAIN2.jpeg"), buffer);
        }
      }
    }

    return NextResponse.json({
      success: true,
      urls: savedUrls,
      message: `Successfully saved ${allFiles.length} actual room image(s) to public/images/`,
    });
  } catch (error) {
    console.error("Failed to save room images:", error);
    return NextResponse.json({ error: "Failed to upload image files" }, { status: 500 });
  }
}

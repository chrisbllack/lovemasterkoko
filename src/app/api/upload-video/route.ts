import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const slug = (formData.get("slug") as string | null) || "executive";

    if (!file) {
      return NextResponse.json({ error: "No video file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const videosDir = path.join(process.cwd(), "public", "videos");
    await fs.mkdir(videosDir, { recursive: true });

    // Save as executive-room.mp4 as well as [slug].mp4
    const filename = `${slug}-room.mp4`;
    const targetPath = path.join(videosDir, filename);
    await fs.writeFile(targetPath, buffer);

    // Also write [slug].mp4 for backwards compatibility
    const aliasPath = path.join(videosDir, `${slug}.mp4`);
    await fs.writeFile(aliasPath, buffer);

    return NextResponse.json({
      success: true,
      url: `/videos/${filename}`,
    });
  } catch (error) {
    console.error("Failed to upload video:", error);
    return NextResponse.json({ error: "Failed to upload video file" }, { status: 500 });
  }
}

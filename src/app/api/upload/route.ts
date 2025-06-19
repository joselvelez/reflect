import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { extractTextFromImage } from '@/src/lib/ocr'

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const filename = `${Date.now()}-${file.name}`
  const filepath = path.join(process.cwd(), 'public/uploads', filename)

  await writeFile(filepath, buffer)

  const text = await extractTextFromImage(filepath)

  return NextResponse.json({
    fileUrl: `/uploads/${filename}`,
    extractedText: text,
  })
}

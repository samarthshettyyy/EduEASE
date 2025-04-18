import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), '/app/classroom/component/detected_emotion.txt')
    const content = await fs.readFile(filePath, 'utf-8')
    const lines = content.trim().split('\n')
    const latestEmotion = lines[lines.length - 1] || 'neutral'

    return NextResponse.json({ emotion: latestEmotion })
  } catch (error) {
    console.error('Error reading emotion file:', error)
    return NextResponse.json({ emotion: 'neutral' })
  }
}

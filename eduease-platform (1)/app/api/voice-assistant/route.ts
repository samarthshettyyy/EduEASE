// app/api/voice-assistant/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { user_input } = await request.json()
    
    // Make a request to your Flask backend
    const response = await fetch('http://localhost:5000/process_voice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_input }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch from Flask backend')
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error processing voice request:', error)
    return NextResponse.json(
      { error: 'Failed to process voice request' },
      { status: 500 }
    )
  }
}
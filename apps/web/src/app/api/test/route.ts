import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('Test API called')
    return NextResponse.json({ success: true, message: 'API is working' })
  } catch (error) {
    console.error('Test API error:', error)
    return NextResponse.json({ error: 'Test failed' }, { status: 500 })
  }
}
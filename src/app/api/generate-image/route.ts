import { NextResponse } from 'next/server'

const API_KEY = process.env.GOOGLE_API_KEY
const CSE_ID = process.env.CUSTOM_SEARCH_ENGINE_ID

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const query = searchParams.get('q')

        if (!query) {
            return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
        }

        const endpoint = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
            query
        )}&cx=${CSE_ID}&key=${API_KEY}&searchType=image&num=10`

        const response = await fetch(endpoint)
        console.log('the response is ', response);
        if (!response.ok) {
            throw new Error('Failed to fetch images')
        }
        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error('Search error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch images' },
            { status: 500 }
        )
    }
}
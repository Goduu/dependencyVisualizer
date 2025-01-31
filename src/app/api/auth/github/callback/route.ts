import { NextResponse } from 'next/server'

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect('/error?message=No code provided')
  }

  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      }),
    })

    const data = await response.json()
    
    if (data.error) {
      throw new Error(data.error_description)
    }

    // Store the token securely (you might want to use cookies or other secure storage)
    const redirectUrl = new URL('/', process.env.NEXT_PUBLIC_APP_URL)
    redirectUrl.searchParams.set('access_token', data.access_token)
    
    return NextResponse.redirect(redirectUrl.toString())
  } catch (error) {
    console.error('Error exchanging code for token:', error)
    return NextResponse.redirect('/error?message=Authentication failed')
  }
} 
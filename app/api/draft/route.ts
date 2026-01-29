import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

// A secret to prevent unauthorized access to this route
const SANITY_PREVIEW_SECRET = process.env.SANITY_PREVIEW_SECRET

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  // Validate the secret
  if (secret !== SANITY_PREVIEW_SECRET) {
    return new Response('Invalid secret', { status: 401 })
  }

  // If no slug is provided, redirect to the homepage
  if (!slug) {
    return new Response('Slug not found', { status: 404 })
  }

  // Enable Draft Mode by setting a cookie
  ;(await draftMode()).enable()

  // Redirect to the post page with the given slug
  redirect(`/post/${slug}`)
}

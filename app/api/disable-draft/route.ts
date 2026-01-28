import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export function GET(request: Request) {
  // Disable Draft Mode by clearing the cookie
  draftMode().disable()

  // Redirect to the homepage or the original page
  const { searchParams } = new URL(request.url)
  const redirect_to = searchParams.get('redirect') || '/'
  
  redirect(redirect_to)
}

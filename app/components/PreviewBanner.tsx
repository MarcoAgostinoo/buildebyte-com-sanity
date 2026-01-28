import { draftMode } from 'next/headers'
import Link from 'next/link'

export default async function PreviewBanner() {
  const { isEnabled } = await draftMode()

  if (!isEnabled) {
    return null
  }

  return (
    <div className="bg-blue-600 text-white p-3 text-center text-sm fixed bottom-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <span>
          You are in preview mode.
        </span>
        <Link 
          href="/api/disable-draft" 
          className="bg-white text-blue-600 font-bold py-1 px-3 rounded-full text-xs hover:bg-blue-100"
        >
          Exit Preview
        </Link>
      </div>
    </div>
  )
}

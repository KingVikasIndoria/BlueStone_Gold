import Head from 'next/head'
import Link from 'next/link'

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Page Not Found - Gold Price Tracker</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Homepage
            </Link>
            <div className="text-sm text-gray-500">
              <p>Looking for gold prices? Check out our city pages:</p>
              <div className="mt-2 space-x-4">
                <Link href="/cities/chennai" className="text-blue-600 hover:underline">
                  Chennai
                </Link>
                <Link href="/cities/mumbai" className="text-blue-600 hover:underline">
                  Mumbai
                </Link>
                <Link href="/cities/delhi" className="text-blue-600 hover:underline">
                  Delhi
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided');
      setIsLoading(false);
      return;
    }

    // Generate download URL
    fetch(`/api/download?session_id=${sessionId}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else if (data.downloadUrl) {
          setDownloadUrl(data.downloadUrl);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching download:', err);
        setError('Failed to generate download link');
        setIsLoading(false);
      });
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {isLoading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Preparing your download...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-8 text-center">
            <div className="text-5xl mb-4">❌</div>
            <h1 className="text-2xl font-bold mb-4 text-red-400">Error</h1>
            <p className="text-gray-300 mb-6">{error}</p>
            <a
              href="/book"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Return to Book Page
            </a>
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 text-transparent bg-clip-text">
              Thank You for Your Purchase!
            </h1>
            <p className="text-gray-300 mb-8 text-lg">
              Your payment was successful. You can download your book below.
            </p>

            {downloadUrl ? (
              <div className="space-y-4">
                <a
                  href={downloadUrl}
                  download
                  className="inline-block w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Download Your Book (PDF)
                </a>

                <p className="text-sm text-gray-500 mt-4">
                  Download link expires in 24 hours. Bookmark this page to regenerate the link if needed.
                </p>

                <p className="text-sm text-gray-400 mt-6">
                  You will also receive a receipt via email from Stripe.
                </p>
              </div>
            ) : (
              <p className="text-gray-400">Generating download link...</p>
            )}

            <div className="mt-8 pt-8 border-t border-gray-800">
              <Link
                href="/"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                ← Return to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}

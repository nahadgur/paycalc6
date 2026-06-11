import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-5 py-20 bg-white">
      <div className="text-center max-w-md">
        <h1 className="editorial-h text-[80px] sm:text-[100px] text-brand leading-none mb-4">Not <span className="italic">found</span>.</h1>
        <p className="text-[#555] mb-8 text-[14px] leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="inline-flex items-center justify-center px-5 py-3 bg-brand text-white rounded-full font-medium text-[13px] hover:bg-brand-600 transition">
            Calculator →
          </Link>
          <Link href="/blog" className="inline-flex items-center justify-center px-5 py-3 bg-white border border-[#eee] text-[#111] rounded-full font-medium text-[13px] hover:border-brand-300 transition">
            Tax guides
          </Link>
        </div>
      </div>
    </div>
  )
}

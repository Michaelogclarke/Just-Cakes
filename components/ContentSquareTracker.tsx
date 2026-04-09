'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

declare global {
  interface Window {
    // eslint-disable-next-line
    _uxa: ((...args: any[]) => void) & { q?: IArguments[] }
  }
}

export default function ContentSquareTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window._uxa === 'function') {
      window._uxa('trackPageview', window.location.pathname + window.location.search)
    }
  }, [pathname, searchParams])

  return null
}

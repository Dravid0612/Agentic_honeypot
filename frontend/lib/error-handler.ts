/**
 * Global error handler for development mode
 * Suppresses non-critical Next.js development warnings
 */

if (typeof window !== 'undefined') {
  // Suppress React and Next.js development warnings
  const originalError = console.error
  const originalWarn = console.warn

  console.error = (...args: any[]) => {
    const message = String(args[0] || '')
    // Only suppress development intrinsics warnings
    if (message.includes('Removing unpermsitted Intrinsics')) return
    if (message.includes('Not implemented')) return
    originalError.apply(console, args)
  }

  console.warn = (...args: any[]) => {
    const message = String(args[0] || '')
    // Suppress Next.js build warnings
    if (message.includes('Loading failed')) return
    originalWarn.apply(console, args)
  }

  // Handle unhandled rejections silently
  window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault()
  })
}

export const buildShareUrl = (path: string) => {
  if (typeof window === 'undefined') return path
  return `${window.location.origin}${path}`
}

export const shareOnX = (url: string, text: string) => {
  const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
  window.open(xUrl, '_blank', 'noopener,noreferrer')
}

export const copyToClipboard = async (url: string) => {
  await navigator.clipboard.writeText(url)
}

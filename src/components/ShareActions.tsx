import { useState } from 'react'
import { buildShareUrl, copyToClipboard, shareOnX } from '../utils/share'

interface ShareActionsProps {
  path: string
  title: string
}

export default function ShareActions({ path, title }: ShareActionsProps) {
  const [copied, setCopied] = useState(false)

  const fullUrl = buildShareUrl(path)

  const handleCopy = async () => {
    try {
      await copyToClipboard(fullUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch (error) {
      console.error('Link kopyalanamadı', error)
    }
  }

  return (
    <div className="share-actions">
      <button type="button" onClick={() => shareOnX(fullUrl, title)} className="share-btn secondary-btn">
        𝕏 Paylaş
      </button>
      <button type="button" onClick={handleCopy} className="share-btn secondary-btn">
        {copied ? 'Kopyalandı' : 'Link Kopyala'}
      </button>
    </div>
  )
}

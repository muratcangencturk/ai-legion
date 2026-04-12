import { useState } from 'react'
import { buildShareUrl, copyToClipboard, shareOnX } from '../utils/share'

interface ShareActionsProps {
  path: string
  title: string
  language: 'tr' | 'en'
}

export default function ShareActions({ path, title, language }: ShareActionsProps) {
  const [copied, setCopied] = useState(false)
  const fullUrl = buildShareUrl(path)

  const handleCopy = async () => {
    try {
      await copyToClipboard(fullUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch (error) {
      console.error('Link could not be copied', error)
    }
  }

  return (
    <div className="share-actions" aria-label={language === 'tr' ? 'Paylaşım eylemleri' : 'Share actions'}>
      <button type="button" onClick={() => shareOnX(fullUrl, title)} className="icon-btn" title="Share on X" aria-label="Share on X">
        𝕏
      </button>
      <button type="button" onClick={handleCopy} className="icon-btn" title={language === 'tr' ? 'Bağlantıyı kopyala' : 'Copy link'} aria-label={language === 'tr' ? 'Bağlantıyı kopyala' : 'Copy link'}>
        {copied ? '✓' : '🔗'}
      </button>
    </div>
  )
}

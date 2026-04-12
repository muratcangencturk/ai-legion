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
      window.setTimeout(() => setCopied(false), 1500)
    } catch (error) {
      console.error('Link could not be copied', error)
    }
  }

  return (
    <div className="share-actions">
      <button type="button" onClick={() => shareOnX(fullUrl, title)} className="share-btn secondary-btn">𝕏 {language === 'tr' ? 'Paylaş' : 'Share'}</button>
      <button type="button" onClick={handleCopy} className="share-btn secondary-btn">{copied ? (language === 'tr' ? 'Kopyalandı' : 'Copied') : (language === 'tr' ? 'Link Kopyala' : 'Copy Link')}</button>
    </div>
  )
}

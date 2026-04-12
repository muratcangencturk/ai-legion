import { useMemo, useState } from 'react'
import { modelSpecs } from '../data/models'

type Language = 'tr' | 'en'

const metrics = {
  tr: [
    { key: 'strengths', label: 'Genel Akıl Yürütme' },
    { key: 'coding', label: 'Kod Yeteneği' },
    { key: 'multimodal', label: 'Multimodal' },
    { key: 'pricePerformance', label: 'Fiyat/Performans' }
  ],
  en: [
    { key: 'strengths', label: 'General Reasoning' },
    { key: 'coding', label: 'Coding Ability' },
    { key: 'multimodal', label: 'Multimodal' },
    { key: 'pricePerformance', label: 'Price/Performance' }
  ]
} as const

const text = {
  tr: { title: '⚔️ Model Arena', provider: 'Sağlayıcı', license: 'Lisans', parameters: 'Parametre', speed: 'Hız', system: 'Sistem', score: 'Karşılaştırma Skoru', leading: 'Önde', tie: 'Berabere' },
  en: { title: '⚔️ Model Arena', provider: 'Provider', license: 'License', parameters: 'Parameters', speed: 'Speed', system: 'System', score: 'Comparison Score', leading: 'Leading', tie: 'Tie' }
}

export default function Arena({ language }: { language: Language }) {
  const t = text[language]
  const [leftId, setLeftId] = useState(modelSpecs[0].id)
  const [rightId, setRightId] = useState(modelSpecs[1].id)

  const left = useMemo(() => modelSpecs.find((m) => m.id === leftId)!, [leftId])
  const right = useMemo(() => modelSpecs.find((m) => m.id === rightId)!, [rightId])
  const currentMetrics = metrics[language]

  const leftWins = currentMetrics.filter((m) => left[m.key] > right[m.key]).length
  const rightWins = currentMetrics.filter((m) => right[m.key] > left[m.key]).length

  return (
    <div>
      <h2 style={{ color: '#d4af37', marginBottom: '24px' }}>{t.title}</h2>
      <div className="arena-selectors card">
        <select value={leftId} onChange={(e) => setLeftId(e.target.value)}>{modelSpecs.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select>
        <span style={{ color: '#d4af37', fontWeight: 700 }}>VS</span>
        <select value={rightId} onChange={(e) => setRightId(e.target.value)}>{modelSpecs.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select>
      </div>

      <div className="grid">{[left, right].map((m) => (
        <article className="card" key={m.id}>
          <h3 style={{ color: '#d4af37' }}>{m.name}</h3>
          <p><strong>{t.provider}:</strong> {m.provider}</p>
          <p><strong>{t.license}:</strong> {m.openSource[language]}</p>
          <p><strong>{t.parameters}:</strong> {m.parameters[language]}</p>
          <p><strong>{t.speed}:</strong> {m.speed[language]}</p>
          <p><strong>{t.system}:</strong> {m.systemNeeds[language]}</p>
        </article>
      ))}</div>

      <div className="card">
        <h3 style={{ color: '#d4af37', marginBottom: '12px' }}>{t.score}</h3>
        {currentMetrics.map((metric) => {
          const l = left[metric.key]
          const r = right[metric.key]
          const leftPct = Math.round((l / (l + r)) * 100)
          return (
            <div key={metric.key} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><small>{metric.label}</small><small>{left.name} {l} - {r} {right.name}</small></div>
              <div className="arena-bar"><div className="arena-bar-left" style={{ width: `${leftPct}%` }} /></div>
            </div>
          )
        })}
        <p style={{ marginTop: '10px' }}><strong>{t.leading}:</strong> {leftWins === rightWins ? t.tie : leftWins > rightWins ? left.name : right.name}</p>
      </div>
    </div>
  )
}

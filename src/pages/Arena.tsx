import { useMemo, useState } from 'react'
import { modelSpecs } from '../data/models'

const metrics = [
  { key: 'strengths', label: 'Genel Akıl Yürütme' },
  { key: 'coding', label: 'Kod Yeteneği' },
  { key: 'multimodal', label: 'Multimodal' },
  { key: 'pricePerformance', label: 'Fiyat/Performans' }
] as const

export default function Arena() {
  const [leftId, setLeftId] = useState(modelSpecs[0].id)
  const [rightId, setRightId] = useState(modelSpecs[1].id)

  const left = useMemo(() => modelSpecs.find((m) => m.id === leftId)!, [leftId])
  const right = useMemo(() => modelSpecs.find((m) => m.id === rightId)!, [rightId])

  const leftWins = metrics.filter((m) => left[m.key] > right[m.key]).length
  const rightWins = metrics.filter((m) => right[m.key] > left[m.key]).length

  return (
    <div>
      <h2 style={{ color: '#d4af37', marginBottom: '24px' }}>⚔️ Model Arena</h2>
      <div className="arena-selectors card">
        <select value={leftId} onChange={(e) => setLeftId(e.target.value)}>
          {modelSpecs.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <span style={{ color: '#d4af37', fontWeight: 700 }}>VS</span>
        <select value={rightId} onChange={(e) => setRightId(e.target.value)}>
          {modelSpecs.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </div>

      <div className="grid">
        {[left, right].map((m) => (
          <article className="card" key={m.id}>
            <h3 style={{ color: '#d4af37' }}>{m.name}</h3>
            <p><strong>Sağlayıcı:</strong> {m.provider}</p>
            <p><strong>Lisans:</strong> {m.openSource}</p>
            <p><strong>Parametre:</strong> {m.parameters}</p>
            <p><strong>Hız:</strong> {m.speed}</p>
            <p><strong>Sistem:</strong> {m.systemNeeds}</p>
          </article>
        ))}
      </div>

      <div className="card">
        <h3 style={{ color: '#d4af37', marginBottom: '12px' }}>Karşılaştırma Skoru</h3>
        {metrics.map((metric) => {
          const l = left[metric.key]
          const r = right[metric.key]
          const total = l + r
          const leftPct = Math.round((l / total) * 100)
          return (
            <div key={metric.key} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <small>{metric.label}</small>
                <small>{left.name} {l} - {r} {right.name}</small>
              </div>
              <div className="arena-bar">
                <div className="arena-bar-left" style={{ width: `${leftPct}%` }} />
              </div>
            </div>
          )
        })}
        <p style={{ marginTop: '10px' }}><strong>Önde:</strong> {leftWins === rightWins ? 'Berabere' : leftWins > rightWins ? left.name : right.name}</p>
      </div>
    </div>
  )
}

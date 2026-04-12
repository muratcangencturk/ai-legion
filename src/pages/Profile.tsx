type Language = 'tr' | 'en'

const text = {
  tr: {
    needLogin: 'Profil görmek için giriş yapmanız gerekir.',
    bio: 'Biyografi: Yapay zeka meraklısı',
    statsInfo: 'Bu profildeki istatistikler canlı veri geldikçe otomatik gösterilir.',
    edit: 'Profili Düzenle'
  },
  en: {
    needLogin: 'You must be logged in to view the profile.',
    bio: 'Bio: AI enthusiast',
    statsInfo: 'Profile stats are automatically shown as live data arrives.',
    edit: 'Edit Profile'
  }
}

export default function Profile({ user, language }: { apiUrl: string; user: any; language: Language }) {
  const t = text[language]

  if (!user) {
    return <div className="card"><p>{t.needLogin}</p></div>
  }

  return (
    <div>
      <div className="card" style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ fontSize: '4em', marginBottom: '10px' }}>👤</div>
        <h2 style={{ color: '#d4af37' }}>{user.username}</h2>
        <p style={{ color: '#999' }}>@{user.username.toLowerCase()}</p>
        <p style={{ marginTop: '10px' }}>{t.bio}</p>
        <div style={{ marginTop: '20px', color: '#999' }}>{t.statsInfo}</div>
        <button style={{ marginTop: '20px' }}>{t.edit}</button>
      </div>
    </div>
  )
}

type Language = 'tr' | 'en'

const text = {
  tr: {
    needLogin: 'Profil görmek için giriş yapmanız gerekir.',
    bio: 'Biyografi: AI Legion üyesi',
    edit: 'Profili Düzenle'
  },
  en: {
    needLogin: 'You must be logged in to view profile.',
    bio: 'Bio: AI Legion member',
    edit: 'Edit Profile'
  }
}

export default function Profile({ user, language, selectedProfile }: { apiUrl: string; user: any; language: Language; selectedProfile?: string }) {
  const t = text[language]
  const profileName = selectedProfile || user?.username

  if (!profileName) return <div className="card"><p>{t.needLogin}</p></div>

  return (
    <div className="card" style={{ textAlign: 'center', marginTop: '24px' }}>
      <div className="avatar-circle">{profileName.slice(0, 1).toUpperCase()}</div>
      <h2>{profileName}</h2>
      <p>@{profileName.toLowerCase().replace(/\s+/g, '')}</p>
      <p style={{ marginTop: '10px' }}>{t.bio}</p>
      {user?.username === profileName && <button style={{ marginTop: '20px' }}>{t.edit}</button>}
    </div>
  )
}

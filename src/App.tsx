import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import Home from './pages/Home'
import Social from './pages/Social'
import Tools from './pages/Tools'
import Tutorials from './pages/Tutorials'
import Profile from './pages/Profile'
import AdminPanel from './pages/AdminPanel'
import Arena from './pages/Arena'

const API_URL = 'https://ai-legion-api.netlify.app'

type Language = 'tr' | 'en'

const NAV_ITEMS: Record<Language, { key: string; label: string }[]> = {
  tr: [
    { key: 'home', label: 'Haberler' },
    { key: 'social', label: 'Sosyal' },
    { key: 'tools', label: 'Araçlar' },
    { key: 'arena', label: 'Arena' },
    { key: 'tutorials', label: 'Öğretici' },
    { key: 'profile', label: 'Profil' },
    { key: 'admin', label: 'Admin' }
  ],
  en: [
    { key: 'home', label: 'News' },
    { key: 'social', label: 'Social' },
    { key: 'tools', label: 'Tools' },
    { key: 'arena', label: 'Arena' },
    { key: 'tutorials', label: 'Tutorials' },
    { key: 'profile', label: 'Profile' },
    { key: 'admin', label: 'Admin' }
  ]
}

const pageTitles: Record<Language, Record<string, string>> = {
  tr: {
    home: 'AI Legion | Akış',
    social: 'AI Legion | Sosyal',
    tools: 'AI Legion | Araçlar',
    arena: 'AI Legion | Arena',
    tutorials: 'AI Legion | Öğreticiler',
    profile: 'AI Legion | Profil',
    admin: 'AI Legion | Admin'
  },
  en: {
    home: 'AI Legion | Feed',
    social: 'AI Legion | Social',
    tools: 'AI Legion | Tools',
    arena: 'AI Legion | Arena',
    tutorials: 'AI Legion | Tutorials',
    profile: 'AI Legion | Profile',
    admin: 'AI Legion | Admin'
  }
}

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [user, setUser] = useState<any>(null)
  const [brandLogo, setBrandLogo] = useState('')
  const [language, setLanguage] = useState<Language>('tr')
  const [selectedProfile, setSelectedProfile] = useState<string>('')

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await axios.get(`${API_URL}/health`)
      } catch (error) {
        console.error('API connection error:', error)
      }
    }
    checkHealth()

    const savedLanguage = localStorage.getItem('siteLanguage') as Language | null
    if (savedLanguage === 'tr' || savedLanguage === 'en') setLanguage(savedLanguage)

    const localSettings = localStorage.getItem('siteSettings')
    if (localSettings) {
      const parsed = JSON.parse(localSettings)
      if (parsed?.header?.image_url) setBrandLogo(parsed.header.image_url)
    }
  }, [])

  useEffect(() => {
    document.title = pageTitles[language][currentPage] || pageTitles[language].home
  }, [currentPage, language])

  const pageContent = useMemo(() => {
    const openProfile = (username: string) => {
      setSelectedProfile(username)
      setCurrentPage('profile')
    }

    switch (currentPage) {
      case 'home':
        return <Home apiUrl={API_URL} onNavigate={setCurrentPage} language={language} onOpenProfile={openProfile} />
      case 'social':
        return <Social apiUrl={API_URL} user={user} setUser={setUser} language={language} onOpenProfile={openProfile} />
      case 'tools':
        return <Tools apiUrl={API_URL} language={language} />
      case 'arena':
        return <Arena language={language} />
      case 'tutorials':
        return <Tutorials language={language} />
      case 'profile':
        return <Profile apiUrl={API_URL} user={user} language={language} selectedProfile={selectedProfile} />
      case 'admin':
        return <AdminPanel apiUrl={API_URL} language={language} />
      default:
        return <Home apiUrl={API_URL} onNavigate={setCurrentPage} language={language} onOpenProfile={openProfile} />
    }
  }, [currentPage, user, language, selectedProfile])

  return (
    <div>
      <header className="header">
        <div className="container">
          <div className="top-row">
            <div className="brand-wrap">
              {brandLogo
                ? <img src={brandLogo} alt="AI Legion Logo" className="brand-logo" />
                : <div className="logo-fallback">AL</div>}
              <h1 className="site-title">AI LEGION</h1>
            </div>
            <div className="lang-switch" aria-label="Language selector">
              <button type="button" className={`lang-item ${language === 'tr' ? 'active' : ''}`} onClick={() => { setLanguage('tr'); localStorage.setItem('siteLanguage', 'tr') }}>TR</button>
              <button type="button" className={`lang-item ${language === 'en' ? 'active' : ''}`} onClick={() => { setLanguage('en'); localStorage.setItem('siteLanguage', 'en') }}>EN</button>
            </div>
          </div>
          <nav className="nav">
            {NAV_ITEMS[language].map(item => (
              <button key={item.key} className={`nav-link ${currentPage === item.key ? 'active' : ''}`} onClick={() => setCurrentPage(item.key)}>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="container page-shell" key={`${currentPage}-${language}`}>
        {pageContent}
      </main>

      <footer className="footer">
        <div className="footer-row">
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="footer-icon">𝕏</a>
          <a href="https://chat.whatsapp.com/LAu2OosQEmd73CBl56sIRi?mode=gi_t" target="_blank" rel="noopener noreferrer" className="footer-icon">🟢</a>
          <span className="footer-muted">AI LEGION</span>
        </div>
      </footer>
    </div>
  )
}

export default App

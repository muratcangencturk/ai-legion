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
    { key: 'home', label: '📰 Haberler' },
    { key: 'social', label: '💬 Sosyal' },
    { key: 'tools', label: '🤖 Araçlar' },
    { key: 'arena', label: '⚔️ Arena' },
    { key: 'tutorials', label: '📚 Öğretici' },
    { key: 'profile', label: '👤 Profil' },
    { key: 'admin', label: '⚙️ Admin' }
  ],
  en: [
    { key: 'home', label: '📰 News' },
    { key: 'social', label: '💬 Social' },
    { key: 'tools', label: '🤖 Tools' },
    { key: 'arena', label: '⚔️ Arena' },
    { key: 'tutorials', label: '📚 Tutorials' },
    { key: 'profile', label: '👤 Profile' },
    { key: 'admin', label: '⚙️ Admin' }
  ]
}

const pageTitles: Record<Language, Record<string, string>> = {
  tr: {
    home: 'AI Legion | Güncel AI Haberleri',
    social: 'AI Legion | Sosyal Akış',
    tools: 'AI Legion | AI Araçları',
    arena: 'AI Legion | Model Arena',
    tutorials: 'AI Legion | Öğretici İçerikler',
    profile: 'AI Legion | Profil',
    admin: 'AI Legion | Admin Panel'
  },
  en: {
    home: 'AI Legion | Latest AI News',
    social: 'AI Legion | Social Feed',
    tools: 'AI Legion | AI Tools',
    arena: 'AI Legion | Model Arena',
    tutorials: 'AI Legion | Tutorials',
    profile: 'AI Legion | Profile',
    admin: 'AI Legion | Admin Panel'
  }
}

const uiText: Record<Language, { mainNav: string; joinWhatsapp: string }> = {
  tr: { mainNav: 'Ana navigasyon', joinWhatsapp: 'WhatsApp grubumuza katılın' },
  en: { mainNav: 'Main navigation', joinWhatsapp: 'Join our WhatsApp group' }
}

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [user, setUser] = useState<any>(null)
  const [brandLogo, setBrandLogo] = useState('')
  const [language, setLanguage] = useState<Language>('tr')

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await axios.get(`${API_URL}/health`)
        console.log('✅ Workers API is running:', response.data)
      } catch (error) {
        console.error('❌ Workers API connection error:', error)
      }
    }
    checkHealth()

    const savedLanguage = localStorage.getItem('siteLanguage') as Language | null
    if (savedLanguage === 'tr' || savedLanguage === 'en') {
      setLanguage(savedLanguage)
    }

    const localSettings = localStorage.getItem('siteSettings')
    if (localSettings) {
      const parsed = JSON.parse(localSettings)
      if (parsed?.header?.image_url) setBrandLogo(parsed.header.image_url)
    }
  }, [])

  useEffect(() => {
    document.title = pageTitles[language][currentPage] || pageTitles[language].home
  }, [currentPage, language])

  const changeLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage)
    localStorage.setItem('siteLanguage', nextLanguage)
  }

  const pageContent = useMemo(() => {
    switch (currentPage) {
      case 'home':
        return <Home apiUrl={API_URL} onNavigate={setCurrentPage} language={language} />
      case 'social':
        return <Social apiUrl={API_URL} user={user} setUser={setUser} language={language} />
      case 'tools':
        return <Tools apiUrl={API_URL} language={language} />
      case 'arena':
        return <Arena language={language} />
      case 'tutorials':
        return <Tutorials language={language} />
      case 'profile':
        return <Profile apiUrl={API_URL} user={user} language={language} />
      case 'admin':
        return <AdminPanel apiUrl={API_URL} language={language} />
      default:
        return <Home apiUrl={API_URL} onNavigate={setCurrentPage} language={language} />
    }
  }, [currentPage, user, language])

  return (
    <div>
      <header className="header">
        <div className="container">
          <div className="top-row">
            <div className="brand-wrap">
              {brandLogo ? <img src={brandLogo} alt="AI Legion Logo" className="brand-logo" /> : <span className="logo-fallback">🏛️</span>}
              <h1 className="site-title">AI LEGION</h1>
            </div>
            <div className="header-controls">
              <div className="lang-switch" aria-label="Language selector">
                <button type="button" className={`lang-item ${language === 'tr' ? 'active' : ''}`} onClick={() => changeLanguage('tr')}>
                  <span className="flag">🇹🇷</span>
                  <small>TR</small>
                </button>
                <button type="button" className={`lang-item ${language === 'en' ? 'active' : ''}`} onClick={() => changeLanguage('en')}>
                  <span className="flag">🇬🇧</span>
                  <small>ENG</small>
                </button>
              </div>
              {user && <span style={{ color: '#d4af37' }}>👤 {user.username}</span>}
            </div>
          </div>
          <nav className="nav" aria-label={uiText[language].mainNav}>
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
          <span>AI LEGION</span>
          <a href="https://chat.whatsapp.com/LAu2OosQEmd73CBl56sIRi?mode=gi_t" target="_blank" rel="noopener noreferrer" className="wa-link">
            {uiText[language].joinWhatsapp}
          </a>
        </div>
      </footer>
    </div>
  )
}

export default App

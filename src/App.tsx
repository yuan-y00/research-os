import { useState, useEffect } from 'react'
import { ResearchReport, WatchlistItem, DailyState } from './types/report'
import { HomePage } from './pages/HomePage'
import { ReportPageV2 } from './pages/ReportPageV2'
import { SignalsPage } from './pages/SignalsPage'
import { WatchlistPage } from './pages/WatchlistPage'

export type Page = 'home' | 'report' | 'signals' | 'watchlist'

export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [reports, setReports] = useState<ResearchReport[]>([])
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [dailyState, setDailyState] = useState<DailyState | null>(null)
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)
  const [readIds, setReadIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('research-os-read-report-ids')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    Promise.all([
      fetch('/research-os/data/reports.json').then(r => r.json()),
      fetch('/research-os/data/watchlist.json').then(r => r.json()),
      fetch('/research-os/data/daily-state.json').then(r => r.json()),
    ]).then(([reportsData, watchlistData, dailyData]) => {
      setReports(reportsData)
      setWatchlist(watchlistData)
      setDailyState(dailyData)
    }).catch(() => {
      setReports([])
      setWatchlist([])
      setDailyState(null)
    })
  }, [])

  const markAsRead = (id: string) => {
    if (!readIds.includes(id)) {
      const next = [...readIds, id]
      setReadIds(next)
      localStorage.setItem('research-os-read-report-ids', JSON.stringify(next))
    }
  }

  const navigateToReport = (id: string) => {
    setSelectedReportId(id)
    setPage('report')
    markAsRead(id)
  }

  const selectedReport = reports.find(r => r.id === selectedReportId || r.slug === selectedReportId)

  return (
    <div className="app-shell">
      <nav className="glass-nav">
        <a href="#" onClick={() => setPage('home')} className="nav-brand">Research OS</a>
        <div className="nav-links">
          <a href="#" onClick={() => setPage('home')} className={page === 'home' ? 'active' : ''}>Reports</a>
          <a href="#" onClick={() => setPage('signals')} className={page === 'signals' ? 'active' : ''}>Signals</a>
          <a href="#" onClick={() => setPage('watchlist')} className={page === 'watchlist' ? 'active' : ''}>Watchlist</a>
        </div>
      </nav>

      <main className="app-content">
        {page === 'home' && (
          <HomePage
            reports={reports}
            readIds={readIds}
            onNavigate={navigateToReport}
            onPageChange={(p) => setPage(p as Page)}
          />
        )}
        {page === 'report' && selectedReport && (
          <ReportPageV2
            report={selectedReport}
            onBack={() => { setPage('home'); setSelectedReportId(null) }}
          />
        )}
        {page === 'signals' && (
          <SignalsPage reports={reports} readIds={readIds} onNavigate={navigateToReport} />
        )}
        {page === 'watchlist' && (
          <WatchlistPage watchlist={watchlist} reports={reports} onNavigate={navigateToReport} />
        )}
      </main>

      <footer className="site-footer">
        <p>Research OS — A personal research operating system.</p>
        <p>Automated daily research on brands, founders, products, and market signals.</p>
      </footer>
    </div>
  )
}

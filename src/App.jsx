import { useState } from 'react'
import './App.css'

const API_BASE = import.meta.env.VITE_API_URL || 'https://deal-desk-ai-backend.up.railway.app'

function App() {
  const [tab, setTab] = useState('generate')
  const [brief, setBrief] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [email, setEmail] = useState('')
  const [checkoutLoading, setCheckoutLoading] = useState(null)

  async function generateProposal(e) {
    e.preventDefault()
    if (!brief.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch(`${API_BASE}/generate-proposal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_brief: brief })
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleCheckout(plan) {
    if (!email.trim()) {
      alert('Please enter your email address first.')
      return
    }
    setCheckoutLoading(plan)
    try {
      const res = await fetch(`${API_BASE}/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, email })
      })
      const data = await res.json()
      if (data.checkout_url) {
        window.location.href = data.checkout_url
      } else {
        alert('Could not create checkout session.')
      }
    } catch (err) {
      alert('Checkout error: ' + err.message)
    } finally {
      setCheckoutLoading(null)
    }
  }

  const plans = [
    { id: 'starter', name: 'Starter', price: '$49/mo', features: ['10 proposals/mo', 'PDF export', 'Email support'] },
    { id: 'pro', name: 'Pro', price: '$149/mo', features: ['50 proposals/mo', 'Custom branding', 'Priority support', 'Analytics'], highlight: true },
    { id: 'agency', name: 'Agency', price: '$399/mo', features: ['Unlimited proposals', 'White-label', 'API access', 'Dedicated account manager'] },
  ]

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-label="Deal Desk AI logo">
              <rect width="32" height="32" rx="8" fill="#6366f1"/>
              <path d="M8 10h10a6 6 0 0 1 0 12H8V10z" fill="white" opacity="0.9"/>
              <circle cx="22" cy="22" r="4" fill="white" opacity="0.5"/>
            </svg>
            <span className="logo-text">Deal Desk AI</span>
          </div>
          <nav className="nav">
            <button className={tab === 'generate' ? 'nav-btn active' : 'nav-btn'} onClick={() => setTab('generate')}>Generate</button>
            <button className={tab === 'pricing' ? 'nav-btn active' : 'nav-btn'} onClick={() => setTab('pricing')}>Pricing</button>
          </nav>
        </div>
      </header>

      <main className="main">
        {tab === 'generate' && (
          <div className="generate-page">
            <div className="hero">
              <h1>AI-Powered Sales Proposals</h1>
              <p>Turn client briefs into polished proposals in seconds. Pricing intelligence included.</p>
            </div>

            <form className="proposal-form" onSubmit={generateProposal}>
              <label htmlFor="brief">Client Brief</label>
              <textarea
                id="brief"
                value={brief}
                onChange={e => setBrief(e.target.value)}
                placeholder="Describe the project: client industry, scope, deliverables, timeline, budget range..."
                rows={6}
                required
              />
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? (
                  <span className="loading-row"><span className="spinner" />Generating...</span>
                ) : 'Generate Proposal'}
              </button>
            </form>

            {error && (
              <div className="error-box">
                <strong>Error:</strong> {error}
                <p className="error-hint">Make sure the backend is running at <code>{API_BASE}</code></p>
              </div>
            )}

            {result && (
              <div className="result-card">
                <div className="result-meta">
                  <div className="meta-item">
                    <span className="meta-label">Suggested Price</span>
                    <span className="meta-value price">${result.suggested_price?.toLocaleString()}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Confidence</span>
                    <span className="meta-value">{Math.round((result.confidence || 0.8) * 100)}%</span>
                  </div>
                  {result.risk_flags && result.risk_flags !== 'None' && (
                    <div className="meta-item risk">
                      <span className="meta-label">Risk Flags</span>
                      <span className="meta-value risk-text">{result.risk_flags}</span>
                    </div>
                  )}
                </div>
                <div className="proposal-body">
                  <h3>Proposal</h3>
                  <div className="proposal-text">
                    {result.proposal?.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </div>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    const blob = new Blob([result.proposal || ''], { type: 'text/plain' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = 'proposal.txt'
                    a.click()
                  }}
                >
                  Download Proposal
                </button>
              </div>
            )}
          </div>
        )}

        {tab === 'pricing' && (
          <div className="pricing-page">
            <div className="hero">
              <h1>Simple, Transparent Pricing</h1>
              <p>Start free, scale as you grow. Cancel anytime.</p>
            </div>

            <div className="email-input-row">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email to get started"
                className="email-input"
              />
            </div>

            <div className="plans-grid">
              {plans.map(plan => (
                <div key={plan.id} className={plan.highlight ? 'plan-card highlight' : 'plan-card'}>
                  {plan.highlight && <div className="plan-badge">Most Popular</div>}
                  <h2>{plan.name}</h2>
                  <div className="plan-price">{plan.price}</div>
                  <ul className="plan-features">
                    {plan.features.map(f => (
                      <li key={f}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="8" fill="#6366f1" opacity="0.15"/>
                          <path d="M4.5 8l2.5 2.5 4.5-4.5" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={plan.highlight ? 'btn-primary' : 'btn-secondary'}
                    onClick={() => handleCheckout(plan.id)}
                    disabled={checkoutLoading === plan.id}
                  >
                    {checkoutLoading === plan.id ? 'Redirecting...' : `Get ${plan.name}`}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>© 2025 Deal Desk AI · Powered by Claude · <a href={`${API_BASE}/health`} target="_blank" rel="noreferrer">API Status</a></p>
      </footer>
    </div>
  )
}

export default App

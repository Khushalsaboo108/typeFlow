import { useNavigate, useLocation } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        background: 'rgba(15, 15, 20, 0.8)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo / Brand */}
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: 0,
          }}
        >
          <img
            src="/icon.png"
            alt="TypeFlow Logo"
            style={{
              height: '36px',
              width: 'auto',
              objectFit: 'contain',
              borderRadius: 'var(--radius-sm)',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '30px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.5px',
            }}
          >
            Type<span style={{ color: 'var(--accent)' }}>Flow</span>
          </span>
        </button>

        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {!isHome && (
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'none',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 16px',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-sans)',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'var(--transition-fast)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.color = 'var(--accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-medium)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Home
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

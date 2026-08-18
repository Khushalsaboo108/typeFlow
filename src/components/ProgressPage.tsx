interface ProgressPageProps {
  wpm: number;
  acc: number;
  timeTaken?: number;
  onRestart: () => void;
  onHome: () => void;
}

export function ProgressPage({ wpm, acc, timeTaken, onRestart, onHome }: ProgressPageProps) {
  const grade = (() => {
    if (wpm >= 80) return { label: 'Pro', color: '#a78bfa', emoji: '🏆' };
    if (wpm >= 60) return { label: 'Fast', color: 'var(--correct)', emoji: '🚀' };
    if (wpm >= 40) return { label: 'Average', color: 'var(--accent)', emoji: '👍' };
    if (wpm >= 20) return { label: 'Beginner', color: 'var(--info)', emoji: '📖' };
    return { label: 'Keep Going', color: 'var(--text-muted)', emoji: '💪' };
  })();

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        position: 'relative',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '400px',
          background: 'radial-gradient(ellipse, var(--accent-glow) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '560px', width: '100%' }}>
        {/* Title */}
        <div
          className="animate-fade-in-up"
          style={{ textAlign: 'center', marginBottom: '40px' }}
        >
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>{grade.emoji}</div>
          <h1
            style={{
              fontSize: '36px',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-1px',
              marginBottom: '8px',
            }}
          >
            Test Complete!
          </h1>
          <p
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: grade.color,
            }}
          >
            {grade.label} Typist
          </p>
        </div>

        {/* Stats cards */}
        <div
          className="animate-fade-in-up"
          style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '32px',
            animationDelay: '0.1s',
          }}
        >
          {/* WPM card */}
          <div
            style={{
              flex: 1,
              background: 'var(--bg-card)',
              backgroundImage: 'var(--gradient-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-card)',
              padding: '28px 24px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '56px',
                fontWeight: 800,
                color: 'var(--correct)',
                lineHeight: 1,
                marginBottom: '8px',
                animation: 'countUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both',
              }}
            >
              {wpm}
            </div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '2px',
              }}
            >
              Words / Min
            </div>
          </div>

          {/* Accuracy card */}
          <div
            style={{
              flex: 1,
              background: 'var(--bg-card)',
              backgroundImage: 'var(--gradient-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-card)',
              padding: '28px 24px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '56px',
                fontWeight: 800,
                color: 'var(--info)',
                lineHeight: 1,
                marginBottom: '8px',
                animation: 'countUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both',
              }}
            >
              {acc}<span style={{ fontSize: '32px' }}>%</span>
            </div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '2px',
              }}
            >
              Accuracy
            </div>
          </div>
        </div>

        {/* Time taken card */}
        {timeTaken !== undefined && (
          <div
            className="animate-fade-in-up"
            style={{
              marginBottom: '32px',
              background: 'var(--bg-card)',
              backgroundImage: 'var(--gradient-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-card)',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              animationDelay: '0.2s',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Time Taken:
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '20px',
                fontWeight: 700,
                color: 'var(--accent)',
              }}
            >
              {formatTime(timeTaken)}
            </span>
          </div>
        )}

        {/* Buttons */}
        <div
          className="animate-fade-in-up"
          style={{
            display: 'flex',
            gap: '12px',
            animationDelay: timeTaken !== undefined ? '0.3s' : '0.2s',
          }}
        >
          <button
            onClick={onRestart}
            style={{
              flex: 1,
              padding: '14px 24px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-medium)',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'var(--transition-fast)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
            Retype Text
          </button>
          <button
            onClick={onHome}
            style={{
              flex: 1,
              padding: '14px 24px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: 'var(--gradient-accent)',
              color: 'var(--bg-primary)',
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'var(--transition-fast)',
              boxShadow: '0 4px 16px rgba(226, 183, 20, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Text
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DEFAULT_TEXT = "The quick brown fox jumps over the lazy dog. Programming is the art of telling another human what one wants the computer to do. Innovation distinguishes between a leader and a follower. Simplicity is the ultimate sophistication. Continuous improvement is better than delayed perfection. The only way to do great work is to love what you do. Stay hungry, stay foolish. Everything you can imagine is real. It always seems impossible until it is done. Believe you can and you're halfway there.";

export function LandingPage() {
  const [mode, setMode] = useState<'random' | 'custom'>('random');
  const [customText, setCustomText] = useState('');
  const navigate = useNavigate();

  const handleStart = () => {
    let finalSourceText = DEFAULT_TEXT;
    if (mode === 'custom' && customText.trim()) {
      finalSourceText = customText.trim();
    }
    navigate('/typing', { state: { sourceText: finalSourceText, isCustom: mode === 'custom' } });
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
          width: '600px',
          height: '400px',
          background: 'radial-gradient(ellipse, var(--accent-glow) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '640px', width: '100%' }}>
        {/* Hero text */}
        <div
          className="animate-fade-in-up"
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <h1
            style={{
              fontSize: '48px',
              fontWeight: 800,
              letterSpacing: '-1.5px',
              lineHeight: 1.1,
              marginBottom: '16px',
              color: 'var(--text-primary)',
            }}
          >
            Test Your{' '}
            <span
              style={{
                background: 'var(--gradient-accent)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Typing Speed
            </span>
          </h1>
          <p
            style={{
              fontSize: '16px',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: '460px',
              margin: '0 auto',
            }}
          >
            Choose a random paragraph or paste your own text. Track your WPM, accuracy, and improve with every session.
          </p>
        </div>

        {/* Card */}
        <div
          className="animate-fade-in-up"
          style={{
            background: 'var(--bg-card)',
            backgroundImage: 'var(--gradient-card)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-card)',
            padding: '32px',
            animationDelay: '0.1s',
          }}
        >
          {/* Mode toggle */}
          <div
            style={{
              display: 'flex',
              gap: '4px',
              padding: '4px',
              background: 'var(--bg-primary)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '24px',
            }}
          >
            {(['random', 'custom'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)',
                  background: mode === m ? 'var(--bg-elevated)' : 'transparent',
                  color: mode === m ? 'var(--accent)' : 'var(--text-muted)',
                  boxShadow: mode === m ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
                }}
              >
                {m === 'random' ? '📝 Random Paragraph' : '✏️ Custom Text'}
              </button>
            ))}
          </div>

          {/* Custom text area */}
          {mode === 'custom' && (
            <div
              style={{ marginBottom: '24px', animation: 'slideDown 0.25s ease both' }}
            >
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  marginBottom: '8px',
                  letterSpacing: '0.3px',
                }}
              >
                PASTE YOUR TEXT
              </label>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Enter the text you want to practice with..."
                style={{
                  width: '100%',
                  height: '160px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '14px',
                  lineHeight: 1.7,
                  resize: 'none',
                  outline: 'none',
                  transition: 'var(--transition-fast)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-glow)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-medium)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          )}

          {/* Random paragraph preview */}
          {mode === 'random' && (
            <div
              style={{
                marginBottom: '24px',
                padding: '16px',
                background: 'var(--bg-primary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                animation: 'slideDown 0.25s ease both',
              }}
            >
              <p
                style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'var(--text-muted)',
                  marginBottom: '8px',
                  letterSpacing: '0.3px',
                  textTransform: 'uppercase',
                }}
              >
                Preview
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  lineHeight: 1.7,
                  color: 'var(--text-secondary)',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {DEFAULT_TEXT}
              </p>
            </div>
          )}

          {/* Start button */}
          <button
            onClick={handleStart}
            disabled={mode === 'custom' && !customText.trim()}
            style={{
              width: '100%',
              padding: '16px',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-sans)',
              fontSize: '16px',
              fontWeight: 700,
              cursor: mode === 'custom' && !customText.trim() ? 'not-allowed' : 'pointer',
              transition: 'var(--transition-normal)',
              background: mode === 'custom' && !customText.trim()
                ? 'var(--bg-elevated)'
                : 'var(--gradient-accent)',
              color: mode === 'custom' && !customText.trim()
                ? 'var(--text-muted)'
                : 'var(--bg-primary)',
              boxShadow: mode === 'custom' && !customText.trim()
                ? 'none'
                : '0 4px 16px rgba(226, 183, 20, 0.3)',
              letterSpacing: '0.5px',
            }}
          >
            Start Typing →
          </button>
        </div>

        {/* Feature pills */}
        <div
          className="animate-fade-in-up"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            marginTop: '32px',
            flexWrap: 'wrap',
            animationDelay: '0.2s',
          }}
        >
          {['⚡ WPM Tracking', '🎯 Accuracy Stats', '⏱️ Timed Mode', '📊 Word Mode'].map((feat) => (
            <span
              key={feat}
              style={{
                fontSize: '12px',
                fontWeight: 500,
                color: 'var(--text-muted)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-secondary)',
              }}
            >
              {feat}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

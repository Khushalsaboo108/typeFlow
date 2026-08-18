import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent, FormEvent } from 'react';

interface TypingTestProps {
  sourceText: string;
  isCustom?: boolean;
  onComplete: (stats: { wpm: number; acc: number; timeTaken?: number }) => void;
}

export function TypingTest({ sourceText, isCustom = false, onComplete }: TypingTestProps) {
  const [mode, setMode] = useState<'time' | 'words'>('time');
  const [customMode, setCustomMode] = useState<'timed' | 'free'>('timed');

  const [timeLimit, setTimeLimit] = useState<number>(30);
  const [wordLimit, setWordLimit] = useState<number>(30);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [elapsed, setElapsed] = useState<number>(0);

  const [typed, setTyped] = useState<string>("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);

  const statsRef = useRef({ typed, totalKeystrokes, errors });
  const hiddenInputRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    statsRef.current = { typed, totalKeystrokes, errors };
  }, [typed, totalKeystrokes, errors]);

  const text = (() => {
    if (isCustom) {
      return sourceText.trim();
    }
    const words = sourceText.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return "";
    const repeatedWords = Array(100).fill(words).flat();
    if (mode === 'words') {
      return repeatedWords.slice(0, wordLimit).join(' ');
    }
    return repeatedWords.slice(0, 300).join(' ');
  })();

  const focusInput = () => {
    hiddenInputRef.current?.focus();
  };

  useEffect(() => {
    focusInput();
  }, []);

  useEffect(() => {
    const caret = document.getElementById("caret");
    if (caret && containerRef.current) {
      const container = containerRef.current;
      const caretRelativeTop = caret.offsetTop;
      if (caretRelativeTop - container.scrollTop >= 117) {
        container.scrollTop = caretRelativeTop - 78;
      } else if (caretRelativeTop < container.scrollTop) {
        container.scrollTop = caretRelativeTop;
      }
    }
  }, [typed]);

  const finishTest = (finalTotalKeystrokes: number, finalErrors: number) => {
    if (!startTime) return;
    const finalEndTime = Date.now();
    const timeTakenSec = Math.round((finalEndTime - startTime) / 1000);
    const durationMin = (finalEndTime - startTime) / 1000 / 60;
    const correctKeystrokes = finalTotalKeystrokes - finalErrors;
    const wpm = durationMin > 0 ? Math.round((correctKeystrokes / 5) / durationMin) : 0;
    const acc = finalTotalKeystrokes > 0
      ? Math.round((correctKeystrokes / finalTotalKeystrokes) * 100)
      : 0;
    onComplete({ wpm, acc, timeTaken: timeTakenSec });
  };

  // Countdown timer (active for random 'time' mode OR custom 'timed' mode)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    const isTimedMode = !isCustom ? mode === 'time' : customMode === 'timed';
    if (startTime && isTimedMode) {
      interval = setInterval(() => {
        const elapsedSec = Math.floor((Date.now() - startTime) / 1000);
        const remaining = timeLimit - elapsedSec;
        if (remaining <= 0) {
          clearInterval(interval);
          const { totalKeystrokes: fTotal, errors: fErrors } = statsRef.current;
          finishTest(fTotal, fErrors);
        } else {
          setTimeLeft(remaining);
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [startTime, timeLimit, mode, isCustom, customMode]);

  // Elapsed timer for custom free mode OR random words mode
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    const isElapsedMode = isCustom ? customMode === 'free' : mode === 'words';
    if (startTime && isElapsedMode) {
      interval = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [startTime, isCustom, customMode, mode]);

  const handleCharInput = (char: string) => {
    if (typed.length >= text.length) return;

    const currentStartTime = startTime || Date.now();
    if (!startTime) setStartTime(currentStartTime);

    const newTotalKeystrokes = totalKeystrokes + 1;
    setTotalKeystrokes(newTotalKeystrokes);

    const isCorrect = char === text[typed.length];
    const newErrors = errors + (isCorrect ? 0 : 1);
    if (!isCorrect) {
      setErrors(newErrors);
    }

    const newTyped = typed + char;
    setTyped(newTyped);

    if (newTyped.length === text.length) {
      const end = Date.now();
      const timeTakenSec = Math.round((end - currentStartTime) / 1000);
      const durationMin = (end - currentStartTime) / 1000 / 60;
      const correctKeystrokes = newTotalKeystrokes - newErrors;
      const wpm = durationMin > 0 ? Math.round((correctKeystrokes / 5) / durationMin) : 0;
      const acc = newTotalKeystrokes > 0
        ? Math.round((correctKeystrokes / newTotalKeystrokes) * 100)
        : 0;
      onComplete({ wpm, acc, timeTaken: timeTakenSec });
    }
  };

  const handleBackspace = () => {
    setTyped((prev) => prev.slice(0, -1));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      handleBackspace();
      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = " ";
      }
    }
  };

  const handleInput = (e: FormEvent<HTMLTextAreaElement>) => {
    const val = e.currentTarget.value;
    if (val === " ") return;

    if (val === "") {
      handleBackspace();
    } else if (val.length > 1) {
      const added = val.slice(1);
      for (let i = 0; i < added.length; i++) {
        handleCharInput(added[i]);
      }
    }

    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = " ";
    }
  };

  // Compute live WPM
  const liveWpm = (() => {
    if (!startTime || totalKeystrokes === 0) return 0;
    const elapsedMin = (Date.now() - startTime) / 1000 / 60;
    if (elapsedMin <= 0) return 0;
    return Math.round(((totalKeystrokes - errors) / 5) / elapsedMin);
  })();

  const wordsTyped = typed.trim() ? typed.trim().split(/\s+/).length : 0;

  // Format elapsed time as mm:ss
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
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
          top: '30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '300px',
          background: 'radial-gradient(ellipse, var(--accent-glow) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', width: '100%' }}>
        {/* Top controls bar */}
        <div
          className="animate-fade-in-up"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '40px',
            minHeight: '64px',
          }}
        >
          {!startTime ? (
            isCustom ? (
              /* Custom mode options before typing */
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    display: 'flex',
                    gap: '4px',
                    padding: '4px',
                    background: 'var(--bg-card)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <button
                    onClick={() => {
                      setCustomMode('timed');
                      focusInput();
                    }}
                    style={{
                      padding: '8px 24px',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'var(--transition-fast)',
                      background: customMode === 'timed' ? 'var(--bg-elevated)' : 'transparent',
                      color: customMode === 'timed' ? 'var(--accent)' : 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    ⏱ Timed
                  </button>
                  <button
                    onClick={() => {
                      setCustomMode('free');
                      focusInput();
                    }}
                    style={{
                      padding: '8px 24px',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'var(--transition-fast)',
                      background: customMode === 'free' ? 'var(--bg-elevated)' : 'transparent',
                      color: customMode === 'free' ? 'var(--accent)' : 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    ♾️ Free Time
                  </button>
                </div>

                {customMode === 'timed' ? (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[10, 20, 30, 60].map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          setTimeLimit(t);
                          setTimeLeft(t);
                          focusInput();
                        }}
                        style={{
                          padding: '6px 18px',
                          borderRadius: 'var(--radius-full)',
                          border: timeLimit === t ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                          background: timeLimit === t ? 'var(--accent-glow)' : 'transparent',
                          color: timeLimit === t ? 'var(--accent)' : 'var(--text-muted)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'var(--transition-fast)',
                        }}
                      >
                        {t}s
                      </button>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                    Type freely at your own pace without any time limit
                  </p>
                )}
              </div>
            ) : (
              /* Random mode: show mode + option selectors */
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                {/* Mode toggle */}
                <div
                  style={{
                    display: 'flex',
                    gap: '4px',
                    padding: '4px',
                    background: 'var(--bg-card)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  {(['time', 'words'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setMode(m);
                        focusInput();
                      }}
                      style={{
                        padding: '8px 24px',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'var(--transition-fast)',
                        background: mode === m ? 'var(--bg-elevated)' : 'transparent',
                        color: mode === m ? 'var(--accent)' : 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {m === 'time' ? '⏱ Time' : '📝 Words'}
                    </button>
                  ))}
                </div>

                {/* Options */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {mode === 'time'
                    ? [10, 30, 60].map((t) => (
                        <button
                          key={t}
                          onClick={() => {
                            setTimeLimit(t);
                            setTimeLeft(t);
                            focusInput();
                          }}
                          style={{
                            padding: '6px 18px',
                            borderRadius: 'var(--radius-full)',
                            border: timeLimit === t ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                            background: timeLimit === t ? 'var(--accent-glow)' : 'transparent',
                            color: timeLimit === t ? 'var(--accent)' : 'var(--text-muted)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'var(--transition-fast)',
                          }}
                        >
                          {t}s
                        </button>
                      ))
                    : [10, 30, 50, 80].map((w) => (
                        <button
                          key={w}
                          onClick={() => {
                            setWordLimit(w);
                            focusInput();
                          }}
                          style={{
                            padding: '6px 18px',
                            borderRadius: 'var(--radius-full)',
                            border: wordLimit === w ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                            background: wordLimit === w ? 'var(--accent-glow)' : 'transparent',
                            color: wordLimit === w ? 'var(--accent)' : 'var(--text-muted)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'var(--transition-fast)',
                          }}
                        >
                          {w}
                        </button>
                      ))}
                </div>
              </div>
            )
          ) : (
            /* Live stats bar (shown for both modes once typing starts) */
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '32px',
                padding: '12px 32px',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              {/* Timer / word count */}
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '32px',
                    fontWeight: 700,
                    color: 'var(--accent)',
                    lineHeight: 1,
                  }}
                >
                  {isCustom
                    ? customMode === 'timed'
                      ? `${timeLeft}s`
                      : formatTime(elapsed)
                    : mode === 'time'
                      ? `${timeLeft}s`
                      : `${wordsTyped}/${wordLimit}`}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 500,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginTop: '4px',
                  }}
                >
                  {isCustom
                    ? customMode === 'timed'
                      ? 'seconds left'
                      : 'elapsed'
                    : mode === 'time'
                      ? 'seconds'
                      : 'words'}
                </div>
              </div>

              {/* Divider */}
              <div style={{ width: '1px', height: '32px', background: 'var(--border-medium)' }} />

              {/* Live WPM */}
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '32px',
                    fontWeight: 700,
                    color: 'var(--correct)',
                    lineHeight: 1,
                  }}
                >
                  {liveWpm}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 500,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginTop: '4px',
                  }}
                >
                  wpm
                </div>
              </div>

              {/* Divider */}
              <div style={{ width: '1px', height: '32px', background: 'var(--border-medium)' }} />

              {/* Errors */}
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '32px',
                    fontWeight: 700,
                    color: errors > 0 ? 'var(--error)' : 'var(--text-muted)',
                    lineHeight: 1,
                  }}
                >
                  {errors}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 500,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginTop: '4px',
                  }}
                >
                  errors
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Text container */}
        <div
          className="animate-fade-in"
          style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-card)',
            padding: '32px',
            position: 'relative',
          }}
          onClick={focusInput}
        >
          {/* Hidden textarea to trigger mobile soft keyboard */}
          <textarea
            ref={hiddenInputRef}
            defaultValue=" "
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            autoComplete="off"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              zIndex: 10,
              cursor: 'text',
              resize: 'none',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: 'transparent',
            }}
          />

          <div
            ref={containerRef}
            style={{
              position: 'relative',
              outline: 'none',
              fontFamily: 'var(--font-mono)',
              fontSize: '22px',
              lineHeight: '40px',
              letterSpacing: '0.5px',
              cursor: 'text',
              userSelect: 'none',
              height: '160px',
              overflow: 'hidden',
              scrollBehavior: 'smooth',
            }}
          >
            {text.split("").map((char, i) => {
              let color = 'var(--text-muted)';
              let bg = 'transparent';
              if (i < typed.length) {
                if (typed[i] === char) {
                  color = 'var(--correct)';
                } else {
                  color = 'var(--error)';
                  bg = 'var(--error-bg)';
                }
              }
              const isCurrent = i === typed.length;

              return (
                <span
                  key={i}
                  id={isCurrent ? "caret" : undefined}
                  style={{
                    color,
                    backgroundColor: bg,
                    borderLeft: isCurrent ? '2px solid var(--accent)' : 'none',
                    animation: isCurrent ? 'pulse-caret 1s infinite' : 'none',
                    borderRadius: i < typed.length && typed[i] !== char ? '2px' : undefined,
                    transition: 'color 0.05s',
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>
        </div>

        {/* Hint text */}
        <p
          className="animate-fade-in-up"
          style={{
            textAlign: 'center',
            fontSize: '13px',
            color: 'var(--text-muted)',
            marginTop: '20px',
            animationDelay: '0.15s',
          }}
        >
          {!startTime
            ? 'Tap the text area above to open keyboard and start typing'
            : 'Press Backspace to correct mistakes'}
        </p>
      </div>
    </div>
  );
}

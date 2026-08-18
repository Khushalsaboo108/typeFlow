import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TypingTest } from './TypingTest';
import { ProgressPage } from './ProgressPage';

export function TypingContainer() {
  const [results, setResults] = useState<{ wpm: number; acc: number; timeTaken?: number } | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const sourceText = location.state?.sourceText;
  const isCustom = location.state?.isCustom ?? false;

  useEffect(() => {
    // If no text is provided, go back to home
    if (!sourceText) {
      navigate('/', { replace: true });
    }
  }, [sourceText, navigate]);

  if (!sourceText) return null;

  if (results) {
    return (
      <ProgressPage 
        wpm={results.wpm} 
        acc={results.acc} 
        timeTaken={results.timeTaken}
        onRestart={() => setResults(null)} 
        onHome={() => navigate('/')} 
      />
    );
  }

  return (
    <TypingTest 
      sourceText={sourceText}
      isCustom={isCustom}
      onComplete={(stats) => setResults(stats)} 
    />
  );
}

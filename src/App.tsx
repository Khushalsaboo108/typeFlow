import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { TypingContainer } from './components/TypingContainer';
import './App.css';

export default function App() {
  return (
    <>
      <Header />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/typing" element={<TypingContainer />} />
        </Routes>
      </main>
    </>
  );
}
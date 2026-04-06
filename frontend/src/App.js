import React, { Suspense } from 'react';
import './App.css';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { Loader2 } from 'lucide-react';

// ⚡ Bolt Performance Optimization:
// Code-split route components using React.lazy() and Suspense.
// This reduces the initial JavaScript bundle size significantly because users
// only download the code for the page they are actively visiting.
const HomePage = React.lazy(() => import('./pages/HomePage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const PrivacyPage = React.lazy(() => import('./pages/PrivacyPage'));
const TermsPage = React.lazy(() => import('./pages/TermsPage'));

// Fallback loader while route chunks are being downloaded
const PageLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <Loader2 className="w-8 h-8 text-[#C4D600] animate-spin" />
  </div>
);

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
          </Routes>
        </Suspense>
        <Toaster />
      </HashRouter>
    </div>
  );
}

export default App;

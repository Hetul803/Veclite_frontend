import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/auth-context';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Why } from './pages/Why';
import { Pricing } from './pages/Pricing';
import { Docs } from './pages/Docs';
import { Portal } from './pages/Portal';
import { Admin } from './pages/Admin';
import { AdminStandalone } from './pages/AdminStandalone';
import { AuthCallback } from './pages/AuthCallback';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-950">
          <Routes>
            <Route path="/" element={<><Header /><Home /></>} />
            <Route path="/why" element={<><Header /><Why /></>} />
            <Route path="/pricing" element={<><Header /><Pricing /></>} />
            <Route path="/docs" element={<><Header /><Docs /></>} />
            <Route path="/app" element={<><Header /><Portal /></>} />
            <Route path="/admin" element={<><Header /><Admin /></>} />
            <Route path="/admin-only" element={<AdminStandalone />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

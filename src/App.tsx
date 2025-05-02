import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ApplyPage from './pages/ApplyPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import ContactPage from './pages/ContactPage';
import CompanyPage from './pages/CompanyPage';
import PrivacyPage from './pages/PrivacyPage';
import SignPage from './pages/SignPage';
import PartnerPage from './pages/PartnerPage';
import ConfirmPage from './pages/ConfirmPage'; // 追加: ConfirmPage をインポート
import { AuthProvider } from './contexts/AuthContext';
import ClaimUrlNotification from './components/ClaimUrlNotification';
import { useAuth } from './contexts/AuthContext';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  return session ? <>{children}</> : <Navigate to="/login" />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { session, isAdmin } = useAuth();
  return session && isAdmin ? <>{children}</> : <Navigate to="/dashboard" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        {window.location.hostname.includes('netlify') && (
          <ClaimUrlNotification
            claimUrl="https://app.netlify.com/claim?utm_source=bolt#eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfaWQiOiI1aDZmZEstVktNTXZuRjNiRlZUaktfU2JKVGgzNlNfMjJheTlpTHhVX0Q4Iiwic2Vzc2lvbl9pZCI6IjQ1NTM0ODY3OjQxNTI4NzciLCJpYXQiOjE3NDQ4NTY1OTZ9.WitWpvmj-2ZDrrbSmDsLYXT0UbULqZWWnrbibmbMf5U"
          />
        )}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/company" element={<CompanyPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/partner" element={<PartnerPage />} />
          <Route path="/sign/:id" element={<SignPage />} />
          <Route 
            path="/apply" 
            element={
              <PrivateRoute>
                <ApplyPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            } 
          />
          <Route path="/confirm" element={<ConfirmPage />} /> {/* 追加: ConfirmPage のルート */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
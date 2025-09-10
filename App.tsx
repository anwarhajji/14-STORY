
import React from 'react';
import { HashRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProvider, useUser } from './contexts/UserContext';

import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import OnboardingPage from './pages/OnboardingPage';
import HomePage from './pages/HomePage';
import StoryPage from './pages/StoryPage';
import EducatorHubPage from './pages/EducatorHubPage';
import PrintableResourcePage from './pages/PrintableResourcePage';
import PrintableResultsPage from './pages/PrintableResultsPage';

const AppLayout: React.FC = () => (
  <div className="flex flex-col min-h-screen bg-base-200">
    <Header />
    <main className="flex-grow container mx-auto p-4 md:p-8">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const { isOnboarded } = useUser();
    if (!isOnboarded) {
        return <Navigate to="/" replace />;
    }
    return children;
};


const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/printable/:id" element={<PrintableResourcePage />} />
        <Route path="/results/:id" element={<PrintableResultsPage />} />
        
        <Route path="/" element={<AppLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="story/:id" element={<ProtectedRoute><StoryPage /></ProtectedRoute>} />
          <Route path="educators" element={<ProtectedRoute><EducatorHubPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <UserProvider>
          <AppRoutes />
        </UserProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;
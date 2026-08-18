import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import UploadForm from "./components/UploadForm";
import DashboardPage from "./pages/DashboardPage";
import DocumentList from "./pages/DocumentList";
import AnalysisPage from "./pages/AnalysisPage";
import AuthPage from "./pages/AuthPage";

function HomePage() {
  return (
    <main className="page-fade">
      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero__inner">
          <p className="home-hero__eyebrow">AI-Powered Legal Analysis</p>
          <h1 className="home-hero__title">
            Contract Intelligence,<br />
            <span className="home-hero__title-accent">Simplified.</span>
          </h1>
          <p className="home-hero__subtitle">
            Upload any contract PDF and instantly extract critical legal clauses,
            identify potential risks, and surface the insights that matter.
          </p>
          <div className="home-hero__features">
            <span className="home-feature-pill"><span>📑</span> Clause Extraction</span>
            <span className="home-feature-pill"><span>⚠️</span> Risk Detection</span>
            <span className="home-feature-pill"><span>🔍</span> NLP Analysis</span>
          </div>
        </div>
      </section>

      {/* Upload card */}
      <section className="home-upload-section">
        <div className="page-container--narrow">
          <UploadForm />
        </div>
      </section>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public route — no Navbar */}
            <Route path="/login" element={<AuthPage />} />

            {/* Protected routes — wrapped with Navbar */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <div className="app-layout">
                    <Navbar />
                    <div className="app-main">
                      <Routes>
                        <Route path="/"              element={<HomePage />} />
                        <Route path="/dashboard"     element={<DashboardPage />} />
                        <Route path="/documents"     element={<DocumentList />} />
                        <Route path="/documents/:id" element={<AnalysisPage />} />
                        {/* Catch-all → home */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
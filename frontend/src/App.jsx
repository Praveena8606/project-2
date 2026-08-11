import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import UploadForm from "./components/UploadForm";
import DocumentList from "./pages/DocumentList";
import AnalysisPage from "./pages/AnalysisPage";

function HomePage() {
  return (
    <main
      style={{
        padding: "40px 20px",
        textAlign: "center",
      }}
    >
      <h1>Welcome to LegalTech Contract Analyzer</h1>

      <p>
        Upload a contract PDF to extract legal clauses and identify risks.
      </p>

      <UploadForm />
    </main>
  );
}


function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <nav
        style={{
          padding: "16px",
          textAlign: "center",
          borderBottom: "1px solid #d1d5db",
        }}
      >
        <Link to="/" style={{ marginRight: "20px" }}>
          Upload
        </Link>

        <Link to="/documents">
          Documents
        </Link>
      </nav>

      <Routes>
    <Route
        path="/"
        element={<HomePage />}
    />

    <Route
        path="/documents"
        element={<DocumentList />}
    />

    <Route
        path="/documents/:id"
        element={<AnalysisPage />}
    />
</Routes>
    </BrowserRouter>
  );
}

export default App;
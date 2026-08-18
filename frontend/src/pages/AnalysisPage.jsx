import { useEffect, useState, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../context/ToastContext";
import RiskScoreRing from "../components/RiskScoreRing";
import ConfirmModal from "../components/ConfirmModal";
import { exportAnalysisReport } from "../utils/exportReport";
import "../components/components.css";
import "./AnalysisPage.css";

function RiskBadge({ severity }) {
  const map = {
    high: "risk-badge risk-high",
    medium: "risk-badge risk-medium",
    low: "risk-badge risk-low",
  };
  const icons = { high: "🔴", medium: "🟡", low: "🟢" };
  const key = severity?.toLowerCase();
  return (
    <span className={map[key] ?? "risk-badge risk-low"}>
      {icons[key] ?? "•"} {severity}
    </span>
  );
}

function StatusBadge({ status }) {
  const map = {
    processed: "badge badge-processed",
    processing: "badge badge-processing",
    uploaded: "badge badge-uploaded",
    failed: "badge badge-failed",
  };
  const cls = map[status?.toLowerCase()] ?? "badge badge-uploaded";
  return <span className={cls}>{status}</span>;
}

function AnalysisPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [document, setDocument] = useState(null);
  const [clauses, setClauses] = useState([]);
  const [risks, setRisks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Clause search & filter
  const [clauseFilter, setClauseFilter] = useState("all");
  const [clauseSearch, setClauseSearch] = useState("");

  // Delete state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const [documentResponse, clausesResponse, risksResponse] =
          await Promise.all([
            axios.get(`http://127.0.0.1:8000/api/documents/${id}/`),
            axios.get(`http://127.0.0.1:8000/api/documents/${id}/clauses/`),
            axios.get(`http://127.0.0.1:8000/api/documents/${id}/risks/`),
          ]);

        setDocument(documentResponse.data);
        setClauses(clausesResponse.data);
        setRisks(risksResponse.data);
      } catch (error) {
        setErrorMessage("Could not load the document analysis.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalysis();
  }, [id]);

  const handleExport = () => {
    if (!document) return;
    exportAnalysisReport(document, clauses, risks);
    addToast("Analysis report exported successfully!", "success");
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`http://127.0.0.1:8000/api/documents/${id}/delete/`);
      addToast(`"${document.title}" was deleted.`, "success");
      navigate("/documents");
    } catch (err) {
      addToast("Failed to delete document.", "error");
      setIsDeleting(false);
    }
  };

  // Distinct clause types for filter
  const distinctClauseTypes = useMemo(() => {
    const types = new Set(clauses.map((c) => c.clause_type));
    return ["all", ...Array.from(types)];
  }, [clauses]);

  // Filtered clauses
  const filteredClauses = useMemo(() => {
    return clauses.filter((clause) => {
      const matchesType =
        clauseFilter === "all" || clause.clause_type === clauseFilter;
      const matchesSearch =
        !clauseSearch.trim() ||
        clause.content.toLowerCase().includes(clauseSearch.toLowerCase().trim()) ||
        clause.clause_type.toLowerCase().includes(clauseSearch.toLowerCase().trim());
      return matchesType && matchesSearch;
    });
  }, [clauses, clauseFilter, clauseSearch]);

  if (isLoading) {
    return (
      <div className="state-center page-fade">
        <div className="spinner-lg" />
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          Extracting legal intelligence…
        </p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="state-center page-fade">
        <div className="feedback-error" style={{ maxWidth: 440 }}>
          <span>⚠️</span> {errorMessage}
        </div>
        <Link to="/documents" className="btn btn-ghost" style={{ marginTop: 8 }}>
          ← Back to Documents
        </Link>
      </div>
    );
  }

  const highRisks = risks.filter((r) => r.severity?.toLowerCase() === "high");
  const mediumRisks = risks.filter((r) => r.severity?.toLowerCase() === "medium");
  const lowRisks = risks.filter((r) => r.severity?.toLowerCase() === "low");
  const sortedRisks = [...highRisks, ...mediumRisks, ...lowRisks];

  return (
    <div className="page-fade">
      {/* Page header with Overview & Actions */}
      <div className="analysis-header">
        <div className="analysis-header__inner">
          <div className="analysis-top-nav">
            <Link to="/documents" className="analysis-header__back">
              ← Back to Documents
            </Link>
            <div className="analysis-actions">
              <button
                className="btn btn-ghost"
                onClick={handleExport}
                type="button"
                title="Download text analysis report"
              >
                <span>📥</span> Export Report
              </button>
              <button
                className="btn btn-ghost btn-ghost--danger"
                onClick={() => setShowDeleteModal(true)}
                type="button"
                title="Delete this contract"
              >
                <span>🗑️</span> Delete
              </button>
            </div>
          </div>

          <div className="analysis-hero-row">
            <div className="analysis-hero-info">
              <div className="analysis-header__title-row">
                <h1>{document.title}</h1>
                <StatusBadge status={document.status} />
              </div>
              <div className="gold-line" style={{ marginTop: 12 }} />
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
                Uploaded on{" "}
                {new Date(document.uploaded_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                &nbsp;·&nbsp;
                {clauses.length} clause{clauses.length !== 1 ? "s" : ""} extracted
                &nbsp;·&nbsp;
                {risks.length} risk{risks.length !== 1 ? "s" : ""} detected
              </p>
            </div>

            {/* Risk score gauge ring */}
            <div className="analysis-hero-gauge">
              <RiskScoreRing risks={risks} />
            </div>
          </div>
        </div>
      </div>

      {/* Body — two columns */}
      <div className="analysis-body">
        {/* Left: Clauses with filter & search */}
        <section className="analysis-clauses-section">
          <div className="analysis-section-header">
            <div className="analysis-section__label" style={{ marginBottom: 0 }}>
              <span>📑</span> Extracted Clauses ({filteredClauses.length}/{clauses.length})
            </div>
          </div>

          {/* Clause filter bar */}
          {clauses.length > 0 && (
            <div className="clause-filter-bar">
              <div className="clause-search-box">
                <input
                  type="text"
                  placeholder="Search in clauses..."
                  value={clauseSearch}
                  onChange={(e) => setClauseSearch(e.target.value)}
                  className="clause-search-input"
                />
                {clauseSearch && (
                  <button
                    className="clause-search-clear"
                    onClick={() => setClauseSearch("")}
                  >
                    ✕
                  </button>
                )}
              </div>

              {distinctClauseTypes.length > 2 && (
                <div className="clause-type-chips">
                  {distinctClauseTypes.map((type) => (
                    <button
                      key={type}
                      className={`clause-filter-btn ${
                        clauseFilter === type ? "clause-filter-btn--active" : ""
                      }`}
                      onClick={() => setClauseFilter(type)}
                    >
                      {type === "all" ? "All Clauses" : type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {clauses.length === 0 ? (
            <div className="empty-state" style={{ minHeight: "200px" }}>
              <div className="empty-icon">📄</div>
              <h3>No clauses found</h3>
            </div>
          ) : filteredClauses.length === 0 ? (
            <div className="empty-state" style={{ minHeight: "150px" }}>
              <div className="empty-icon">🔍</div>
              <h3>No clauses matched</h3>
              <p style={{ fontSize: 13, marginBottom: 12 }}>
                Try adjusting your search keywords or clause type filter.
              </p>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setClauseSearch("");
                  setClauseFilter("all");
                }}
              >
                Reset Filter
              </button>
            </div>
          ) : (
            filteredClauses.map((clause, i) => (
              <article
                key={clause.id}
                className="clause-card animate-in"
                style={{ animationDelay: `${Math.min(i * 40, 250)}ms` }}
              >
                <div className="clause-card__top">
                  <span className="clause-chip">{clause.clause_type}</span>
                  <span className="page-chip">📄 Page {clause.page_number}</span>
                </div>
                <p className="clause-card__content">{clause.content}</p>
              </article>
            ))
          )}
        </section>

        {/* Right: Risks */}
        <aside className="analysis-risks-section">
          <div className="analysis-section__label">
            <span>⚠️</span> Risk Analysis ({risks.length})
          </div>

          {risks.length === 0 ? (
            <div className="empty-state" style={{ minHeight: "160px" }}>
              <div className="empty-icon">✅</div>
              <h3>No risks detected</h3>
              <p style={{ fontSize: 13 }}>This contract looks clean!</p>
            </div>
          ) : (
            sortedRisks.map((risk, i) => {
              const sev = risk.severity?.toLowerCase();
              return (
                <article
                  key={risk.id}
                  className={`risk-card risk-card--${sev} animate-in`}
                  style={{ animationDelay: `${Math.min(i * 50, 300)}ms` }}
                >
                  <div className="risk-card__header">
                    <h3 className="risk-card__keyword">{risk.keyword}</h3>
                    <RiskBadge severity={risk.severity} />
                  </div>
                  <p className="risk-card__description">{risk.description}</p>
                </article>
              );
            })
          )}
        </aside>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Contract?"
        message={`Are you sure you want to delete "${document.title}"? All extracted clauses and risk flags will be removed permanently.`}
        confirmText={isDeleting ? "Deleting..." : "Yes, Delete"}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        isDanger={true}
      />
    </div>
  );
}

export default AnalysisPage;
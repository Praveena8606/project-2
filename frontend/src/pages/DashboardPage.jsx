import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./DashboardPage.css";

function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/stats/");
        setStats(response.data);
      } catch (err) {
        setError("Could not load dashboard statistics. Check server connection.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="state-center page-fade">
        <div className="spinner-lg" />
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          Gathering contract intelligence…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container page-fade">
        <div className="feedback-error" style={{ maxWidth: 500, margin: "40px auto" }}>
          <span>⚠️</span> {error}
        </div>
      </div>
    );
  }

  const {
    total_documents = 0,
    processed_documents = 0,
    processing_documents = 0,
    failed_documents = 0,
    total_clauses = 0,
    total_risks = 0,
    risk_distribution = { high: 0, medium: 0, low: 0 },
    clause_distribution = [],
    recent_documents = [],
  } = stats || {};

  const totalRisksCount =
    (risk_distribution.high || 0) +
    (risk_distribution.medium || 0) +
    (risk_distribution.low || 0);

  const processedPercentage = total_documents
    ? Math.round((processed_documents / total_documents) * 100)
    : 0;

  return (
    <div className="page-container page-fade">
      {/* Dashboard header */}
      <div className="dashboard-header">
        <div>
          <h1>Analytics Dashboard</h1>
          <div className="gold-line" />
          <p className="dashboard-subtitle">
            Overview of contract analysis, extracted clauses, and risk trends
          </p>
        </div>
        <Link to="/" className="btn btn-primary">
          <span>+</span> Upload New Contract
        </Link>
      </div>

      {/* Primary KPI Grid */}
      <div className="kpi-grid">
        <div className="card kpi-card">
          <div className="kpi-icon kpi-icon--navy">📁</div>
          <div className="kpi-body">
            <span className="kpi-label">Total Contracts</span>
            <span className="kpi-value">{total_documents}</span>
            <span className="kpi-subtext">
              {processed_documents} processed ({processedPercentage}%)
            </span>
          </div>
        </div>

        <div className="card kpi-card">
          <div className="kpi-icon kpi-icon--gold">📑</div>
          <div className="kpi-body">
            <span className="kpi-label">Extracted Clauses</span>
            <span className="kpi-value">{total_clauses}</span>
            <span className="kpi-subtext">
              Avg {total_documents ? (total_clauses / total_documents).toFixed(1) : 0} per document
            </span>
          </div>
        </div>

        <div className="card kpi-card">
          <div className="kpi-icon kpi-icon--danger">⚠️</div>
          <div className="kpi-body">
            <span className="kpi-label">Identified Risks</span>
            <span className="kpi-value">{total_risks}</span>
            <span className="kpi-subtext">
              {risk_distribution.high || 0} critical high severity
            </span>
          </div>
        </div>

        <div className="card kpi-card">
          <div className="kpi-icon kpi-icon--success">⚡</div>
          <div className="kpi-body">
            <span className="kpi-label">System Health</span>
            <span className="kpi-value">
              {failed_documents === 0 ? "100%" : `${100 - Math.round((failed_documents / total_documents) * 100)}%`}
            </span>
            <span className="kpi-subtext">
              {failed_documents} failed extraction{failed_documents !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Two-column detailed breakdown */}
      <div className="dashboard-grid">
        {/* Left: Risk Breakdown & Top Clause Types */}
        <div className="dashboard-col">
          {/* Risk severity breakdown card */}
          <div className="card dashboard-card">
            <h3 className="dashboard-card-title">
              <span>🛡️</span> Risk Severity Distribution
            </h3>
            {totalRisksCount === 0 ? (
              <p className="no-data-text">No risks detected across uploaded contracts.</p>
            ) : (
              <div className="risk-bars-container">
                <div className="risk-bar-group">
                  <div className="risk-bar-header">
                    <span className="risk-label-dot risk-label-dot--high">High Severity</span>
                    <span className="risk-count">
                      {risk_distribution.high} ({Math.round((risk_distribution.high / totalRisksCount) * 100 || 0)}%)
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill progress-fill--high"
                      style={{
                        width: `${(risk_distribution.high / totalRisksCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="risk-bar-group">
                  <div className="risk-bar-header">
                    <span className="risk-label-dot risk-label-dot--medium">Medium Severity</span>
                    <span className="risk-count">
                      {risk_distribution.medium} ({Math.round((risk_distribution.medium / totalRisksCount) * 100 || 0)}%)
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill progress-fill--medium"
                      style={{
                        width: `${(risk_distribution.medium / totalRisksCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="risk-bar-group">
                  <div className="risk-bar-header">
                    <span className="risk-label-dot risk-label-dot--low">Low Severity</span>
                    <span className="risk-count">
                      {risk_distribution.low} ({Math.round((risk_distribution.low / totalRisksCount) * 100 || 0)}%)
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill progress-fill--low"
                      style={{
                        width: `${(risk_distribution.low / totalRisksCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Top Clause Categories */}
          <div className="card dashboard-card">
            <h3 className="dashboard-card-title">
              <span>📚</span> Top Clause Categories
            </h3>
            {clause_distribution.length === 0 ? (
              <p className="no-data-text">No clauses extracted yet.</p>
            ) : (
              <div className="clause-dist-list">
                {clause_distribution.map((item) => (
                  <div key={item.clause_type} className="clause-dist-item">
                    <span className="clause-dist-name">{item.clause_type}</span>
                    <span className="clause-dist-badge">{item.count} clauses</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Recent Contracts */}
        <div className="dashboard-col">
          <div className="card dashboard-card" style={{ height: "100%" }}>
            <div className="recent-header">
              <h3 className="dashboard-card-title">
                <span>🕒</span> Recent Contracts
              </h3>
              <Link to="/documents" className="view-all-link">
                View all →
              </Link>
            </div>

            {recent_documents.length === 0 ? (
              <p className="no-data-text">No documents uploaded yet.</p>
            ) : (
              <div className="recent-list">
                {recent_documents.map((doc) => (
                  <Link
                    key={doc.id}
                    to={`/documents/${doc.id}`}
                    className="recent-item"
                  >
                    <div className="recent-icon">📄</div>
                    <div className="recent-info">
                      <span className="recent-title">{doc.title}</span>
                      <span className="recent-date">
                        {new Date(doc.uploaded_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <span
                      className={`badge badge-${doc.status?.toLowerCase() || "uploaded"}`}
                    >
                      {doc.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;

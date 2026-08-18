import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useToast } from "../context/ToastContext";
import ConfirmModal from "../components/ConfirmModal";
import "../components/components.css";
import "./DocumentList.css";

function StatusBadge({ status }) {
  const map = {
    processed: "badge badge-processed",
    processing: "badge badge-processing",
    uploaded: "badge badge-uploaded",
    failed: "badge badge-failed",
  };
  const cls = map[status?.toLowerCase()] ?? "badge badge-uploaded";
  const icons = {
    processed: "✓",
    processing: "⟳",
    uploaded: "↑",
    failed: "✕",
  };
  return (
    <span className={cls}>
      {icons[status?.toLowerCase()] ?? "•"} {status}
    </span>
  );
}

function SkeletonCard() {
  return (
    <div className="card skeleton-card">
      <div className="skeleton skeleton-line" style={{ width: "60%", marginBottom: 12 }} />
      <div className="skeleton skeleton-line" style={{ width: "40%", height: 10 }} />
      <div className="skeleton skeleton-line" style={{ width: "80%", height: 10, marginTop: 8 }} />
      <div style={{ marginTop: 24, paddingTop: 12, borderTop: "1px solid var(--navy-border)" }}>
        <div className="skeleton skeleton-line" style={{ width: "30%", height: 28, marginLeft: "auto", borderRadius: 20 }} />
      </div>
    </div>
  );
}

function DocumentList() {
  const { addToast } = useToast();
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Search, Filter, Sort state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Delete modal state
  const [docToDelete, setDocToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/documents/");
      setDocuments(response.data);
    } catch (error) {
      setErrorMessage("Could not load documents. Check whether Django is running.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async () => {
    if (!docToDelete) return;
    setIsDeleting(true);
    try {
      await axios.delete(`http://127.0.0.1:8000/api/documents/${docToDelete.id}/delete/`);
      setDocuments((prev) => prev.filter((d) => d.id !== docToDelete.id));
      addToast(`"${docToDelete.title}" was deleted successfully.`, "success");
      setDocToDelete(null);
    } catch (err) {
      addToast("Failed to delete document. Please try again.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter & Sort computation
  const filteredDocuments = useMemo(() => {
    return documents
      .filter((doc) => {
        const matchesSearch = doc.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase().trim());
        const matchesStatus =
          statusFilter === "all" ||
          doc.status?.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.uploaded_at) - new Date(a.uploaded_at);
        }
        if (sortBy === "oldest") {
          return new Date(a.uploaded_at) - new Date(b.uploaded_at);
        }
        if (sortBy === "title-asc") {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === "title-desc") {
          return b.title.localeCompare(a.title);
        }
        return 0;
      });
  }, [documents, searchQuery, statusFilter, sortBy]);

  return (
    <div className="page-container page-fade">
      {/* Header */}
      <div className="doc-list-header">
        <div>
          <h1 style={{ marginBottom: 6 }}>Documents</h1>
          <div className="gold-line" />
          <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
            Search, filter, and inspect your uploaded contracts
          </p>
        </div>
        <Link to="/" className="btn btn-primary">
          <span>+</span> Upload Contract
        </Link>
      </div>

      {/* Search & Filter Toolbar */}
      {!isLoading && !errorMessage && documents.length > 0 && (
        <div className="doc-toolbar">
          {/* Search box */}
          <div className="doc-search-wrap">
            <span className="doc-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search contracts by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="doc-search-input"
            />
            {searchQuery && (
              <button
                className="doc-search-clear"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="doc-toolbar-actions">
            {/* Status filters */}
            <div className="doc-status-pills">
              {["all", "processed", "processing", "uploaded", "failed"].map((status) => (
                <button
                  key={status}
                  className={`doc-filter-pill ${
                    statusFilter === status ? "doc-filter-pill--active" : ""
                  }`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            {/* Sort Select */}
            <div className="doc-sort-wrap">
              <label htmlFor="doc-sort" className="doc-sort-label">
                Sort:
              </label>
              <select
                id="doc-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="doc-sort-select"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Count summary */}
      {!isLoading && !errorMessage && documents.length > 0 && (
        <div className="doc-results-info">
          <span>
            Showing <strong>{filteredDocuments.length}</strong> of {documents.length} contract
            {documents.length !== 1 ? "s" : ""}
          </span>
          {(searchQuery || statusFilter !== "all") && (
            <button
              className="doc-reset-filters-btn"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="doc-grid">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Error */}
      {!isLoading && errorMessage && (
        <div className="feedback-error" style={{ maxWidth: 520, margin: "0 auto" }}>
          <span>⚠️</span> {errorMessage}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !errorMessage && documents.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📂</div>
          <h3>No contracts yet</h3>
          <p style={{ fontSize: 14, marginBottom: 20 }}>
            Upload your first contract PDF to get started with clause extraction.
          </p>
          <Link to="/" className="btn btn-primary">
            Upload a Contract →
          </Link>
        </div>
      )}

      {/* No Results from filter */}
      {!isLoading &&
        !errorMessage &&
        documents.length > 0 &&
        filteredDocuments.length === 0 && (
          <div className="empty-state" style={{ padding: "40px 20px" }}>
            <div className="empty-icon">🔍</div>
            <h3>No matching contracts</h3>
            <p style={{ fontSize: 14, marginBottom: 16 }}>
              No documents matched your search query or filter selection.
            </p>
            <button
              className="btn btn-ghost"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
            >
              Clear All Filters
            </button>
          </div>
        )}

      {/* Document grid */}
      {!isLoading && !errorMessage && filteredDocuments.length > 0 && (
        <div className="doc-grid">
          {filteredDocuments.map((doc, i) => (
            <article
              key={doc.id}
              className="card doc-card animate-in"
              style={{ animationDelay: `${Math.min(i * 40, 300)}ms` }}
            >
              <div className="doc-card__header">
                <span className="doc-card__icon">📄</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 className="doc-card__title" title={doc.title}>
                    {doc.title}
                  </h3>
                </div>
                <StatusBadge status={doc.status} />
              </div>

              <div className="doc-card__meta">
                <span>🕐</span>
                <span>
                  {new Date(doc.uploaded_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="doc-card__footer">
                <button
                  type="button"
                  className="doc-delete-btn"
                  title="Delete contract"
                  onClick={() => setDocToDelete(doc)}
                  aria-label="Delete document"
                >
                  🗑️
                </button>
                <Link
                  to={`/documents/${doc.id}`}
                  className="btn btn-ghost"
                  style={{ fontSize: 13 }}
                >
                  View Analysis →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(docToDelete)}
        title="Delete Contract?"
        message={`Are you sure you want to delete "${docToDelete?.title}"? All extracted clauses and risk flags for this document will be permanently removed.`}
        confirmText={isDeleting ? "Deleting..." : "Yes, Delete"}
        onConfirm={handleDelete}
        onCancel={() => setDocToDelete(null)}
        isDanger={true}
      />
    </div>
  );
}

export default DocumentList;
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../context/ToastContext";
import "../components/components.css";

function UploadForm() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [title, setTitle] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (file) => {
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setMessage("");
    } else if (file) {
      setMessage("Only PDF files are accepted.");
      setIsError(true);
    }
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0] || null;
    handleFileChange(file);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setMessage("Please enter a document title.");
      setIsError(true);
      return;
    }
    if (!pdfFile) {
      setMessage("Please choose or drop a PDF file.");
      setIsError(true);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("uploaded_file", pdfFile);

    try {
      setIsUploading(true);
      setMessage("");
      setProgress(10);

      // Simulate progress increments while waiting for the API
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 85) {
            clearInterval(progressInterval);
            return 85;
          }
          return prev + Math.random() * 12;
        });
      }, 400);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/upload/",
        formData,
      );

      clearInterval(progressInterval);
      setProgress(100);

      const documentId = response.data.id;
      addToast(`"${title}" analyzed successfully!`, "success");
      setTitle("");
      setPdfFile(null);
      event.target.reset();

      setTimeout(() => {
        navigate(`/documents/${documentId}`);
      }, 400);
    } catch (error) {
      console.error("Upload error:", error);
      const apiError =
        error.response?.data?.uploaded_file?.[0] ||
        error.response?.data?.title?.[0] ||
        error.response?.data?.detail ||
        "Upload failed. Please check the Django server.";
      setMessage(apiError);
      setIsError(true);
      addToast(apiError, "error");
      setProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-form-card animate-in">
      <h2>Upload Contract</h2>
      <p className="form-subtitle">
        PDF files only · Max analysis time ~10 seconds
      </p>

      <form onSubmit={handleSubmit} noValidate>
        {/* Title field */}
        <div className="field">
          <label htmlFor="doc-title">Document Title</label>
          <input
            id="doc-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Service Agreement Q3 2025"
            disabled={isUploading}
          />
        </div>

        {/* Drop zone */}
        <div
          className={`drop-zone${isDragOver ? " drop-zone--drag-over" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          aria-label="PDF drop zone"
        >
          <input
            id="pdf-upload"
            type="file"
            accept=".pdf,application/pdf"
            className="drop-zone__input"
            disabled={isUploading}
            onChange={(e) => handleFileChange(e.target.files[0] || null)}
            aria-label="Choose PDF file"
          />

          {pdfFile ? (
            <div className="drop-zone__file-selected">
              <span>📄</span>
              <span>{pdfFile.name}</span>
              <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                ({(pdfFile.size / 1024).toFixed(0)} KB)
              </span>
            </div>
          ) : (
            <>
              <span className="drop-zone__icon">📂</span>
              <p className="drop-zone__text">
                Drop your PDF here, or{" "}
                <span style={{ color: "var(--gold)", fontWeight: 600 }}>
                  browse
                </span>
              </p>
              <p className="drop-zone__subtext">Supports PDF up to 20 MB</p>
            </>
          )}
        </div>

        {/* Submit */}
        <button
          id="upload-submit-btn"
          type="submit"
          className="btn btn-primary"
          style={{ width: "100%", justifyContent: "center", padding: "13px" }}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <span className="spinner" />
              Analyzing contract…
            </>
          ) : (
            "Upload & Analyze →"
          )}
        </button>

        {/* Progress bar */}
        {isUploading && (
          <div className="upload-progress">
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="upload-progress__label" style={{ marginTop: "8px" }}>
              Extracting clauses &amp; detecting risks…
            </p>
          </div>
        )}

        {/* Feedback message */}
        {message && !isUploading && (
          <div className={isError ? "feedback-error" : "feedback-success"}>
            <span>{isError ? "⚠️" : "✅"}</span>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

export default UploadForm;
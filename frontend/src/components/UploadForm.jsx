import { useState } from "react";
import axios from "axios";


function UploadForm() {
  const [title, setTitle] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setMessage("Please enter a document title.");
      return;
    }

    if (!pdfFile) {
      setMessage("Please choose a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("uploaded_file", pdfFile);

    try {
      setIsUploading(true);
      setMessage("");

      const response = await axios.post(
        "http://127.0.0.1:8000/api/upload/",
        formData,
      );

      setMessage(
        `Upload successful. Document status: ${response.data.status}`,
      );

      setTitle("");
      setPdfFile(null);
      event.target.reset();
    } catch (error) {
      const apiError =
        error.response?.data?.uploaded_file?.[0] ||
        error.response?.data?.title?.[0] ||
        "Upload failed. Please check the Django server.";

      setMessage(apiError);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: "560px",
        margin: "30px auto",
        padding: "24px",
        border: "1px solid #d1d5db",
        borderRadius: "10px",
      }}
    >
      <h2>Upload Contract PDF</h2>

      <div style={{ marginBottom: "18px", textAlign: "left" }}>
        <label htmlFor="title">Document title</label>

        <input
          id="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "6px",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div style={{ marginBottom: "18px", textAlign: "left" }}>
        <label htmlFor="uploaded-file">PDF file</label>

        <input
          id="uploaded-file"
          type="file"
          accept=".pdf,application/pdf"
          onChange={(event) => {
            setPdfFile(event.target.files[0] || null);
          }}
          style={{
            display: "block",
            marginTop: "6px",
          }}
        />
      </div>

      <button type="submit" disabled={isUploading}>
        {isUploading ? "Uploading..." : "Upload and Analyze"}
      </button>

      {message && (
        <p style={{ marginTop: "18px" }}>
          {message}
        </p>
      )}
    </form>
  );
}

export default UploadForm;
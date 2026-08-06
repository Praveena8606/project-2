import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";


function DocumentList() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/documents/",
        );

        setDocuments(response.data);
      } catch (error) {
        setErrorMessage(
          "Could not load documents. Check whether Django is running.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  if (isLoading) {
    return <p>Loading documents...</p>;
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  return (
    <section
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
      }}
    >
      <h2>Uploaded Documents</h2>

      {documents.length === 0 ? (
        <p>No documents uploaded yet.</p>
      ) : (
        documents.map((document) => (
          <article
            key={document.id}
            style={{
              border: "1px solid #d1d5db",
              borderRadius: "10px",
              padding: "18px",
              marginBottom: "16px",
              textAlign: "left",
            }}
          >
            <h3>{document.title}</h3>

            <p>
              <strong>Status:</strong> {document.status}
            </p>

            <p>
              <strong>Uploaded:</strong>{" "}
              {new Date(document.uploaded_at).toLocaleString()}
            </p>

            <Link
              to={`/documents/${document.id}`}
              style={{
                display: "inline-block",
                marginTop: "8px",
                color: "#2563eb",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              View Analysis →
            </Link>
          </article>
        ))
      )}
    </section>
  );
}

export default DocumentList;
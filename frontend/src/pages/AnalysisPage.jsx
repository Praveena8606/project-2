import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";


function AnalysisPage() {
  const { id } = useParams();

  const [document, setDocument] = useState(null);
  const [clauses, setClauses] = useState([]);
  const [risks, setRisks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const [documentResponse, clausesResponse, risksResponse] =
          await Promise.all([
            axios.get(
              `http://127.0.0.1:8000/api/documents/${id}/`,
            ),
            axios.get(
              `http://127.0.0.1:8000/api/documents/${id}/clauses/`,
            ),
            axios.get(
              `http://127.0.0.1:8000/api/documents/${id}/risks/`,
            ),
          ]);

        setDocument(documentResponse.data);
        setClauses(clausesResponse.data);
        setRisks(risksResponse.data);
      } catch (error) {
        setErrorMessage(
          "Could not load the document analysis.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [id]);

  if (isLoading) {
    return <p style={{ textAlign: "center" }}>Loading analysis...</p>;
  }

  if (errorMessage) {
    return <p style={{ textAlign: "center" }}>{errorMessage}</p>;
  }

  return (
    <main
      style={{
        maxWidth: "1000px",
        margin: "40px auto",
        padding: "20px",
      }}
    >
      <h1>{document.title}</h1>

<Link
  to="/documents"
  style={{
    display: "inline-block",
    marginBottom: "20px",
    padding: "10px 16px",
    backgroundColor: "#e5e7eb",
    color: "#1f2937",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
  }}
>
  ← Back to Documents
</Link>
      <p>
        <strong>Status:</strong> {document.status}
      </p>

      <section style={{ marginTop: "32px" }}>
        <h2>Extracted Clauses</h2>

        {clauses.length === 0 ? (
          <p>No clauses found.</p>
        ) : (
          clauses.map((clause) => (
           <article
  key={clause.id}
  style={{
    borderLeft: "5px solid #2563eb",
    borderRadius: "10px",
    padding: "18px",
    marginBottom: "16px",
    backgroundColor: "#ffffff",
  }}
>
  <h3
    style={{
      color: "#1e3a8a",
      marginBottom: "10px",
    }}
  >
    {clause.clause_type}
  </h3>

  <p
    style={{
      lineHeight: "1.6",
      color: "#4b5563",
    }}
  >
    {clause.content}
  </p>

  <small
    style={{
      display: "block",
      marginTop: "10px",
      color: "#6b7280",
    }}
  >
    Page {clause.page_number}
  </small>
</article>
          ))
        )}
      </section>

      <section style={{ marginTop: "32px" }}>
        <h2>Risk Analysis</h2>

        {risks.length === 0 ? (
          <p>No risks detected.</p>
        ) : (
          risks.map((risk) => (
            <article
              key={risk.id}
              style={{
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "12px",
              }}
            >
             <h3>
  {risk.keyword}

  <span
    style={{
      marginLeft: "12px",
      padding: "4px 10px",
      borderRadius: "20px",
      color: "white",
      backgroundColor:
        risk.severity === "High"
          ? "#dc2626"
          : risk.severity === "Medium"
          ? "#f59e0b"
          : "#16a34a",
      fontSize: "14px",
    }}
  >
    {risk.severity}
  </span>
</h3>

              <p>{risk.description}</p>
            </article>
          ))
        )}
      </section>
    </main>
  );
}

export default AnalysisPage;
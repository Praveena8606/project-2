/**
 * Utility to generate and download a comprehensive contract analysis report as a .txt file.
 */
export function exportAnalysisReport(document, clauses = [], risks = []) {
  const timestamp = new Date().toLocaleString();
  const sep = "=".repeat(60);
  const subSep = "-".repeat(60);

  let report = `${sep}\n`;
  report += `   LEGALTECH CONTRACT ANALYSIS REPORT\n`;
  report += `${sep}\n\n`;
  report += `Document Title: ${document.title}\n`;
  report += `Status:         ${document.status}\n`;
  report += `Uploaded At:    ${new Date(document.uploaded_at).toLocaleString()}\n`;
  report += `Report Date:    ${timestamp}\n`;
  report += `Total Clauses:  ${clauses.length}\n`;
  report += `Total Risks:    ${risks.length}\n\n`;

  // Risk Summary
  report += `${subSep}\n`;
  report += `1. RISK ANALYSIS SUMMARY\n`;
  report += `${subSep}\n\n`;

  if (risks.length === 0) {
    report += `No legal risks detected in this contract.\n\n`;
  } else {
    risks.forEach((risk, index) => {
      report += `[Risk ${index + 1}] ${risk.keyword.toUpperCase()} (${risk.severity.toUpperCase()} SEVERITY)\n`;
      report += `Description: ${risk.description}\n\n`;
    });
  }

  // Clause Extraction
  report += `${subSep}\n`;
  report += `2. EXTRACTED CLAUSES\n`;
  report += `${subSep}\n\n`;

  if (clauses.length === 0) {
    report += `No clauses extracted.\n\n`;
  } else {
    clauses.forEach((clause, index) => {
      report += `[Clause ${index + 1}] ${clause.clause_type.toUpperCase()} (Page ${clause.page_number})\n`;
      report += `Content:\n${clause.content}\n\n`;
    });
  }

  report += `${sep}\n`;
  report += `Generated automatically by LegalTech Contract Intelligence Engine.\n`;
  report += `${sep}\n`;

  // Trigger download via Blob
  const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement ? window.document.createElement("a") : null;
  if (link) {
    const filename = `${document.title.replace(/[^a-zA-Z0-9_-]/g, "_")}_analysis_report.txt`;
    link.href = url;
    link.download = filename;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

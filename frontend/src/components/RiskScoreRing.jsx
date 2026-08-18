import "./RiskScoreRing.css";

function RiskScoreRing({ risks = [], size = 88 }) {
  // Score formula: High*30 + Medium*15 + Low*5 (capped at 100)
  const score = Math.min(
    100,
    risks.reduce((acc, risk) => {
      const sev = risk.severity?.toLowerCase();
      if (sev === "high") return acc + 30;
      if (sev === "medium") return acc + 15;
      if (sev === "low") return acc + 5;
      return acc;
    }, 0)
  );

  let statusLabel = "Low Risk";
  let statusClass = "risk-ring--low";
  let strokeColor = "var(--success)";

  if (score >= 70) {
    statusLabel = "High Risk";
    statusClass = "risk-ring--high";
    strokeColor = "var(--danger)";
  } else if (score >= 40) {
    statusLabel = "Medium Risk";
    statusClass = "risk-ring--medium";
    strokeColor = "var(--warn)";
  }

  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`risk-score-container ${statusClass}`}>
      <div className="risk-ring-wrapper" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="risk-ring-svg">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="var(--navy-elevated)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 0.8s ease-out, stroke 0.3s ease",
            }}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <div className="risk-ring-text">
          <span className="risk-ring-score">{score}</span>
          <span className="risk-ring-max">/100</span>
        </div>
      </div>
      <div className="risk-score-details">
        <span className="risk-score-badge">{statusLabel}</span>
        <span className="risk-score-desc">Overall Risk Index</span>
      </div>
    </div>
  );
}

export default RiskScoreRing;

from .models import RiskFlag


RISK_KEYWORDS = {
    "indemnify": "High",
    "unlimited liability": "High",
    "breach": "High",
    "exclusive": "High",
    "liability": "Medium",
    "terminate": "Medium",
    "penalty": "Medium",
    "confidential": "Low",
}


def detect_risks(document):
    """
    Detect risk keywords in the document text and save them.
    """

    if not document.extracted_text:
        return []

    text = document.extracted_text.lower()

    saved_risks = []

    for keyword, severity in RISK_KEYWORDS.items():
        if keyword in text:
            risk = RiskFlag.objects.create(
                document=document,
                keyword=keyword,
                severity=severity,
                description=f"Detected '{keyword}' in the contract.",
            )

            saved_risks.append(risk)

    return saved_risks
def extract_clauses(text):
    clauses = []

    keywords = {
        "Confidentiality": "confidential",
        "Termination": "termination",
        "Payment": "payment",
        "Liability": "liability",
        "Governing Law": "governing law",
        "Indemnity": "indemnify",
    }

    text_lower = text.lower()

    for clause_name, keyword in keywords.items():
        if keyword in text_lower:
            clauses.append(
                {
                    "clause_type": clause_name,
                    "content": keyword,
                }
            )

    return clauses
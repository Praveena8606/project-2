from .models import ExtractedClause


def categorize_clause(paragraph):
    text = paragraph.lower().strip()

    if "confidential" in text:
        return "Confidentiality"

    elif "terminate" in text or "termination" in text:
        return "Termination"

    elif "payment" in text or "invoice" in text:
        return "Payment"

    elif (
        "governing law" in text
        or "governed by" in text
        or "jurisdiction" in text
        or "laws of" in text
    ):
        return "Governing Law"

    elif "liability" in text:
        return "Liability"

    elif "indemn" in text:
        return "Indemnity"

    return "Other"


def extract_and_save_clauses(document):
    if not document.extracted_text:
        return []

    paragraphs = [
        paragraph.strip()
        for paragraph in document.extracted_text.split("\n")
        if paragraph.strip()
    ]

    saved_clauses = []

    for paragraph in paragraphs:
        clause_type = categorize_clause(paragraph)

        if clause_type == "Other":
            continue

        clause = ExtractedClause.objects.create(
            document=document,
            clause_type=clause_type,
            content=paragraph,
            page_number=1,
        )

        saved_clauses.append(clause)

    return saved_clauses
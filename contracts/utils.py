import re

import fitz


def clean_extracted_text(text: str) -> str:
    """
    Clean text extracted from a PDF while preserving paragraphs.
    """

    if not text:
        return ""

    # Normalize Windows and old Mac line endings.
    text = text.replace("\r\n", "\n").replace("\r", "\n")

    # Join words broken by hyphenation across lines.
    # Example: "agree-\nment" becomes "agreement".
    text = re.sub(r"(\w)-\n(\w)", r"\1\2", text)

    # Mark paragraph breaks temporarily.
    text = re.sub(r"\n\s*\n+", "<PARAGRAPH_BREAK>", text)

    # Replace remaining single line breaks with spaces.
    text = re.sub(r"\s*\n\s*", " ", text)

    # Remove repeated spaces and tabs.
    text = re.sub(r"[ \t]+", " ", text)

    # Restore paragraph breaks.
    text = text.replace("<PARAGRAPH_BREAK>", "\n\n")

    # Remove spaces around paragraph boundaries.
    text = re.sub(r" *\n\n *", "\n\n", text)

    return text.strip()


def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extract and clean text from every page of a PDF.
    """

    extracted_pages = []

    with fitz.open(pdf_path) as pdf_document:
        for page_number, page in enumerate(pdf_document, start=1):
            raw_text = page.get_text("text")
            cleaned_text = clean_extracted_text(raw_text)

            if cleaned_text:
                extracted_pages.append(
                    f"--- Page {page_number} ---\n{cleaned_text}"
                )

    return "\n\n".join(extracted_pages)
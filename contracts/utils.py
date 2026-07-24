import fitz


def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extract and combine text from every page of a PDF file.
    """

    extracted_pages = []

    with fitz.open(pdf_path) as pdf_document:
        for page_number, page in enumerate(pdf_document, start=1):
            page_text = page.get_text("text").strip()

            if page_text:
                extracted_pages.append(
                    f"--- Page {page_number} ---\n{page_text}"
                )

    return "\n\n".join(extracted_pages)
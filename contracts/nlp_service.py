import spacy

# Load the English NLP model
nlp = spacy.load("en_core_web_sm")


def extract_named_entities(text):
    """
    Extract organizations, dates, and locations from contract text.
    """

    if not text:
        return {
            "organizations": [],
            "dates": [],
            "locations": []
        }

    doc = nlp(text)

    organizations = []
    dates = []
    locations = []

    for ent in doc.ents:
        if ent.label_ == "ORG":
            organizations.append(ent.text)

        elif ent.label_ == "DATE":
            dates.append(ent.text)

        elif ent.label_ in ["GPE", "LOC"]:
            locations.append(ent.text)

    return {
        "organizations": list(set(organizations)),
        "dates": list(set(dates)),
        "locations": list(set(locations))
    }
def extract_legal_details(text: str) -> dict:
    """
    Extract governing law and jurisdiction from contract text.
    """

    if not text:
        return {
            "governing_law": None,
            "jurisdiction": None,
        }

    lines = [
        line.strip()
        for line in text.split("\n")
        if line.strip()
    ]

    governing_law = None
    jurisdiction = None

    for line in lines:
        lower_line = line.lower()

        if (
            "governing law" in lower_line
            or "governed by" in lower_line
            or "laws of" in lower_line
        ):
            governing_law = line

        if (
            "jurisdiction" in lower_line
            or "courts of" in lower_line
            or "exclusive jurisdiction" in lower_line
        ):
            jurisdiction = line

    return {
        "governing_law": governing_law,
        "jurisdiction": jurisdiction,
    }
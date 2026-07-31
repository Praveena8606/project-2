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
from django.test import SimpleTestCase

from .utils import clean_extracted_text


class TextCleaningTests(SimpleTestCase):
    def test_removes_extra_spaces(self):
        text = "The Company     shall pay."
        result = clean_extracted_text(text)

        self.assertEqual(
            result,
            "The Company shall pay.",
        )

    def test_fixes_hyphenated_line_break(self):
        text = "This agree-\nment is valid."
        result = clean_extracted_text(text)

        self.assertEqual(
            result,
            "This agreement is valid.",
        )

    def test_preserves_paragraph_breaks(self):
        text = "First paragraph.\n\nSecond paragraph."
        result = clean_extracted_text(text)

        self.assertEqual(
            result,
            "First paragraph.\n\nSecond paragraph.",
        )

    def test_empty_text(self):
        result = clean_extracted_text("")

        self.assertEqual(result, "")
from django.db import models


class Document(models.Model):
    title = models.CharField(max_length=255)
    uploaded_file = models.FileField(upload_to="documents/")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default="Uploaded")
    extracted_text = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.title


class ExtractedClause(models.Model):
    document = models.ForeignKey(
        Document,
        on_delete=models.CASCADE,
        related_name="clauses",
    )
    clause_type = models.CharField(max_length=100)
    content = models.TextField()
    page_number = models.IntegerField()

    def __str__(self):
        return self.clause_type


class RiskFlag(models.Model):
    document = models.ForeignKey(
        Document,
        on_delete=models.CASCADE,
        related_name="risk_flags",
    )
    keyword = models.CharField(max_length=100)
    severity = models.CharField(max_length=20)
    description = models.TextField()

    def __str__(self):
        return self.keyword
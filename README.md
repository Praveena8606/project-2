# LegalTech – Automated Contract Parsing & Risk Extraction Engine

## Project Overview

This project is developed as part of the Advanced Python Engineering Internship Program. The objective is to build a LegalTech application that automates contract processing by allowing users to upload PDF contracts, extract important legal clauses, identify potential legal risks, and provide structured contract information through REST APIs.

---

# Week 1 Progress – Django Setup and Document Management

## Objective

The objective of Week 1 was to establish the backend foundation of the LegalTech application by setting up Django, configuring PostgreSQL, designing the database schema, and implementing a secure PDF upload API.

---

## Completed Tasks

### 1. Project Setup

- Created GitHub repository
- Created Python virtual environment
- Installed Django 5.2
- Created Django project (`config`)
- Created Django application (`contracts`)
- Configured Git and GitHub

---

### 2. PostgreSQL Configuration

- Installed PostgreSQL 17
- Created database `legaltech_db`
- Connected Django with PostgreSQL
- Configured database settings
- Successfully applied Django migrations

---

### 3. Database Models

Implemented the following models:

### Document

Stores uploaded contract information including:

- Contract title
- Uploaded PDF file
- Upload timestamp
- Processing status

### ExtractedClause

Stores legal clauses extracted from uploaded contracts.

### RiskFlag

Stores identified legal risks and severity levels for each contract.

---

### 4. Django REST Framework Integration

- Installed Django REST Framework
- Configured REST Framework
- Created serializers
- Verified project configuration

---

### 5. Secure PDF Upload API

Implemented a secure REST API for uploading contract documents.

### API Endpoint

POST /api/upload/

Features:

- Accepts multipart/form-data
- Uploads PDF files
- Stores files inside `media/documents/`
- Saves document information into PostgreSQL
- Returns JSON response

---

## Project Structure

project-2/

├── config/

├── contracts/

│ ├── migrations/

│ ├── models.py

│ ├── serializers.py

│ ├── views.py

│ ├── urls.py

│ └── admin.py

├── media/

├── manage.py

├── requirements.txt

├── README.md

└── .gitignore

---

## Technologies Used

- Python 3.11
- Django 5.2
- Django REST Framework
- PostgreSQL 17
- Git
- GitHub
- VS Code

---

## Week 1 Results

Successfully completed:

- Django project setup
- PostgreSQL integration
- Database schema design
- REST API development
- PDF upload functionality
- File storage configuration
- Database storage verification

The upload API was tested successfully and stores uploaded PDF files in the local media directory while recording document details in the PostgreSQL database.

---

## Current Project Status

| Module | Status |
|---------|--------|
| Django Setup | ✅ Completed |
| PostgreSQL Configuration | ✅ Completed |
| Database Models | ✅ Completed |
| REST Framework Setup | ✅ Completed |
| PDF Upload API | ✅ Completed |
| API Testing | ✅ Completed |

### Overall Progress

**Week 1: 100% Completed**

---

## Next Phase (Week 2)

- Integrate PyMuPDF (Fitz)
- Extract text from uploaded PDF contracts
- Store extracted contract text
- Prepare data for clause extraction
- Build contract processing pipeline

---

## Author

**Praveena Prakash**

Advanced Python Engineering Internship

LegalTech – Automated Contract Parsing & Risk Extraction Engine
# Pneumonia Detection Backend

This is the Flask-based backend for the Pneumonia Detection application.

## Setup Instructions

### 1. Prerequisites
- Python 3.8 or higher
- `pip` (Python package manager)

### 2. Create and Activate Virtual Environment
A virtual environment has been already initialized in the `env` folder.

**On Linux/macOS:**
```bash
source env/bin/activate
```

**On Windows:**
```bash
.\env\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Environment Variables
Create a `.env` file in this directory (or use the one in the root) with the following content:
```env
PORT=5000
FLASK_ENV=development
```

### 5. Run the Application
```bash
python app.py
```
```bash
flask run
```
The API will be available at `http://localhost:5000`.

## API Endpoints
- `GET /`: Welcome message
- `GET /api/health`: Health check
- `GET /api/info`: Application information

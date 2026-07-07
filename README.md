# Hospital Management REST API

A full-stack **Hospital Management System** built using **Express.js**, **SQLite (better-sqlite3)**, and **React + Vite**. This project allows users to manage hospital patient records with complete CRUD operations, search, pagination, dark mode, and a modern responsive dashboard.

---

## Features

### Backend

- Express.js REST API
- SQLite database using better-sqlite3
- Automatic database and table creation
- Complete CRUD operations
- Pagination support
- Search functionality
- Duplicate email validation
- Required field validation
- JSON responses
- CORS enabled

### Frontend

- Patient registration form
- Live character counter (Patient Name)
- Client-side form validation
- Edit existing patient details
- Delete patient records
- Search patients
- Pagination
- Loading indicator
- Last Updated timestamp
- Dark Mode
- Responsive design
- Patient avatar initials
- API error handling

---

## Technologies Used

### Backend

- Node.js
- Express.js
- better-sqlite3
- CORS

### Frontend

- React
- Vite
- CSS3

### Database

- SQLite

---

## Project Structure

```
Hospital-Management/

│
├── backend/
│   └── server/
│       ├── index.js
│       └── data.db
│
├── frontend/
│   └── apiDemo/
│       └── src/
│           ├── App.jsx
│           └── App.css
│
└── postman/
    ├── Hospital-Management-API.postman_collection.json
    └── Hospital-Management.postman_environment.json
```

---

## Database Schema

Table Name:

```
patients
```

| Column | Type |
|---------|------|
| id | INTEGER PRIMARY KEY AUTOINCREMENT |
| patient_name | TEXT |
| email | TEXT UNIQUE |
| phone | TEXT |
| age | INTEGER |
| gender | TEXT |
| blood_group | TEXT |
| disease | TEXT |
| doctor_name | TEXT |
| admission_date | TEXT |
| discharge_date | TEXT |
| status | TEXT |
| created_at | TIMESTAMP |

---

## REST API Endpoints

### Register Patient

```
POST /patients
```

Registers a new patient.

---

### Get All Patients

```
GET /patients
```

Supports

- Pagination
- Search
- Sorting

Example

```
GET /patients?page=1&limit=5
```

```
GET /patients?search=Rahul
```

---

### Get Patient By ID

```
GET /patients/:id
```

Returns a single patient.

---

### Update Patient

```
PUT /patients/:id
```

Updates patient information.

---

### Delete Patient

```
DELETE /patients/:id
```

Deletes a patient record.

---

## Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/hospital-management.git
```

---

### Backend

```bash
cd backend/server
```

Install dependencies

```bash
npm install
```

Run server

```bash
node index.js
```

Server starts at

```
http://localhost:5000
```

---

### Frontend

```bash
cd frontend/apiDemo
```

Install packages

```bash
npm install
```

Start React application

```bash
npm run dev
```

Default URL

```
http://localhost:5173
```

---

## API Response Example

```json
{
    "message": "Patient Registered Successfully",
    "patient": {
        "id": 1,
        "patient_name": "Rahul Kumar",
        "email": "rahul@example.com",
        "phone": "9876543210",
        "age": 30,
        "gender": "Male",
        "blood_group": "O+",
        "disease": "Fever",
        "doctor_name": "Dr. Sharma",
        "admission_date": "2026-07-07",
        "discharge_date": "2026-07-10",
        "status": "Admitted"
    }
}
```

---

## Pagination Response

```json
{
    "data": [],
    "page": 1,
    "limit": 5,
    "total": 15,
    "totalPages": 3
}
```

---

## Validation

The API validates:

- Required fields
- Duplicate email
- Invalid patient ID
- Missing patient records

Status Codes

| Code | Meaning |
|------|----------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 404 | Not Found |
| 409 | Duplicate Email |
| 500 | Internal Server Error |

---

## Frontend Features

- Responsive Hospital Dashboard
- Register New Patient
- Update Patient
- Delete Patient
- Search Patients
- Pagination
- Avatar Initials
- Loading Indicator
- Dark Mode
- Character Counter
- Last Updated Timestamp
- API Error Messages

---

## Postman Testing

Import the following files into Postman:

```
Hospital-Management-API.postman_collection.json
```

```
Hospital-Management.postman_environment.json
```

Environment Variable

```
base_url=http://localhost:5000
```

---

## Future Improvements

- Doctor Management
- Appointment Scheduling
- Authentication
- JWT Login
- Role-Based Access
- Medical History
- Billing System
- Patient Reports
- Dashboard Analytics
- File Upload
- Prescription Module

---

## Author

Developed as a Full Stack Hospital Management REST API Project using Express.js, SQLite, React, and Vite.

---

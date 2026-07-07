// backend/server/index.js

const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
const PORT = 5000;

// Connect to SQLite database
const db = new Database("data.db");

// Middleware
app.use(cors());
app.use(express.json());

// Create hospital table if it doesn't exist
db.prepare(`
CREATE TABLE IF NOT EXISTS hospital (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    gender TEXT NOT NULL,
    appointment_date TEXT NOT NULL,
    appointment_time TEXT NOT NULL,
    doctor_name TEXT NOT NULL,
    department TEXT NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`).run();

console.log("✅ Hospital table is ready.");

// ----------------------
// CREATE PATIENT
// ----------------------
app.post("/hospital", (req, res) => {
    const {
        patient_name,
        phone,
        address,
        gender,
        appointment_date,
        appointment_time,
        doctor_name,
        department
    } = req.body;

    // Validate required fields
    if (
        !patient_name ||
        !phone ||
        !address ||
        !gender ||
        !appointment_date ||
        !appointment_time ||
        !doctor_name ||
        !department
    ) {
        return res.status(400).json({
            message: "All fields are required."
        });
    }

    // Check duplicate appointment
    const duplicate = db.prepare(`
        SELECT * FROM hospital
        WHERE patient_name = ?
        AND appointment_date = ?
        AND appointment_time = ?
    `).get(patient_name, appointment_date, appointment_time);

    if (duplicate) {
        return res.status(409).json({
            message: "Patient already has an appointment at this date and time."
        });
    }

    // Insert patient
    const result = db.prepare(`
        INSERT INTO hospital
        (
            patient_name,
            phone,
            address,
            gender,
            appointment_date,
            appointment_time,
            doctor_name,
            department
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
        patient_name,
        phone,
        address,
        gender,
        appointment_date,
        appointment_time,
        doctor_name,
        department
    );

    res.status(201).json({
        message: "Patient registered successfully.",
        id: result.lastInsertRowid
    });
});

// ----------------------
// GET ALL PATIENTS
// ----------------------
app.get("/hospital", (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";

    const offset = (page - 1) * limit;

    const where = `
        WHERE
        patient_name LIKE ?
        OR doctor_name LIKE ?
        OR department LIKE ?
    `;

    const keyword = `%${search}%`;

    const total = db.prepare(`
        SELECT COUNT(*) AS total
        FROM hospital
        ${where}
    `).get(keyword, keyword, keyword).total;

    const patients = db.prepare(`
        SELECT *
        FROM hospital
        ${where}
        ORDER BY registered_at DESC
        LIMIT ?
        OFFSET ?
    `).all(keyword, keyword, keyword, limit, offset);

    res.json({
        data: patients,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
    });
});

// ----------------------
// GET SINGLE PATIENT
// ----------------------
app.get("/hospital/:id", (req, res) => {

    const patient = db.prepare(`
        SELECT *
        FROM hospital
        WHERE id = ?
    `).get(req.params.id);

    if (!patient) {
        return res.status(404).json({
            message: "Patient not found."
        });
    }

    res.json(patient);
});

// ----------------------
// UPDATE PATIENT
// ----------------------
app.put("/hospital/:id", (req, res) => {

    const patient = db.prepare(`
        SELECT *
        FROM hospital
        WHERE id = ?
    `).get(req.params.id);

    if (!patient) {
        return res.status(404).json({
            message: "Patient not found."
        });
    }

    const updated = {
        patient_name: req.body.patient_name || patient.patient_name,
        phone: req.body.phone || patient.phone,
        address: req.body.address || patient.address,
        gender: req.body.gender || patient.gender,
        appointment_date:
            req.body.appointment_date || patient.appointment_date,
        appointment_time:
            req.body.appointment_time || patient.appointment_time,
        doctor_name: req.body.doctor_name || patient.doctor_name,
        department: req.body.department || patient.department
    };

    db.prepare(`
        UPDATE hospital
        SET
        patient_name=?,
        phone=?,
        address=?,
        gender=?,
        appointment_date=?,
        appointment_time=?,
        doctor_name=?,
        department=?
        WHERE id=?
    `).run(
        updated.patient_name,
        updated.phone,
        updated.address,
        updated.gender,
        updated.appointment_date,
        updated.appointment_time,
        updated.doctor_name,
        updated.department,
        req.params.id
    );

    res.json({
        message: "Patient updated successfully."
    });
});

// ----------------------
// DELETE PATIENT
// ----------------------
app.delete("/hospital/:id", (req, res) => {

    const result = db.prepare(`
        DELETE FROM hospital
        WHERE id=?
    `).run(req.params.id);

    if (result.changes === 0) {
        return res.status(404).json({
            message: "Patient not found."
        });
    }

    res.json({
        message: "Patient deleted successfully."
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
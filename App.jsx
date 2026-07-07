// frontend/apiDemo/src/App.jsx

import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000/hospital";

function App() {
  // ---------------------------
  // Form State
  // ---------------------------
  const [form, setForm] = useState({
    patient_name: "",
    phone: "",
    address: "",
    gender: "",
    appointment_date: "",
    appointment_time: "",
    doctor_name: "",
    department: "",
  });

  // Patient list
  const [patients, setPatients] = useState([]);

  // Editing id
  const [editId, setEditId] = useState(null);

  // Search
  const [search, setSearch] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Loading
  const [loading, setLoading] = useState(false);

  // Error Message
  const [error, setError] = useState("");

  // Success Message
  const [success, setSuccess] = useState("");

  // Dark Mode
  const [darkMode, setDarkMode] = useState(false);

  // Last Updated
  const [lastUpdated, setLastUpdated] = useState("");

  // ---------------------------
  // Load Patients
  // ---------------------------
  const fetchPatients = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        `${API}?page=${page}&limit=5&search=${search}`
      );

      const data = await res.json();

      setPatients(data.data);
      setTotalPages(data.totalPages);
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPatients();
  }, [page, search]);

  // ---------------------------
  // Handle Input
  // ---------------------------
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ---------------------------
  // Reset Form
  // ---------------------------
  const resetForm = () => {
    setForm({
      patient_name: "",
      phone: "",
      address: "",
      gender: "",
      appointment_date: "",
      appointment_time: "",
      doctor_name: "",
      department: "",
    });

    setEditId(null);
  };

  // ---------------------------
  // Submit Form
  // ---------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.patient_name ||
      !form.phone ||
      !form.address ||
      !form.gender ||
      !form.appointment_date ||
      !form.appointment_time ||
      !form.doctor_name ||
      !form.department
    ) {
      setError("Please fill all fields.");
      return;
    }

    try {
      let response;

      if (editId) {
        response = await fetch(`${API}/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
      } else {
        response = await fetch(API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      setSuccess(data.message);

      resetForm();
      fetchPatients();
    } catch (err) {
      setError("Server Error");
    }
  };

  // ---------------------------
  // Delete Patient
  // ---------------------------
  const deletePatient = async (id) => {
    if (!window.confirm("Delete this patient?")) return;

    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });

    fetchPatients();
  };

  // ---------------------------
  // Edit Patient
  // ---------------------------
  const editPatient = (patient) => {
    setEditId(patient.id);

    setForm({
      patient_name: patient.patient_name,
      phone: patient.phone,
      address: patient.address,
      gender: patient.gender,
      appointment_date: patient.appointment_date,
      appointment_time: patient.appointment_time,
      doctor_name: patient.doctor_name,
      department: patient.department,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <div className="container">

        <div className="header">
          <h1>Hospital Management</h1>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="darkBtn"
          >
            {darkMode ? "☀ Light" : "🌙 Dark"}
          </button>
        </div>

        {/* Form */}

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="patient_name"
            placeholder="Patient Name"
            maxLength="40"
            value={form.patient_name}
            onChange={handleChange}
          />

          <small>
            {form.patient_name.length}/40 Characters
          </small>

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
          />

          <textarea
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
          ></textarea>

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <input
            type="date"
            name="appointment_date"
            value={form.appointment_date}
            onChange={handleChange}
          />

          <input
            type="time"
            name="appointment_time"
            value={form.appointment_time}
            onChange={handleChange}
          />

          <input
            type="text"
            name="doctor_name"
            placeholder="Doctor Name"
            value={form.doctor_name}
            onChange={handleChange}
          />

          <select
            name="department"
            value={form.department}
            onChange={handleChange}
          >
            <option value="">Select Department</option>
            <option>General Medicine</option>
            <option>Cardiology</option>
            <option>Orthopedics</option>
            <option>Pediatrics</option>
            <option>Neurology</option>
            <option>Dermatology</option>
          </select>

          {error && <p className="error">{error}</p>}

          {success && <p className="success">{success}</p>}

          <button type="submit">
            {editId ? "Update Patient" : "Register Patient"}
          </button>

          <button
            type="button"
            onClick={resetForm}
          >
            Reset
          </button>

        </form>

        {/* Search */}

        <input
          className="search"
          placeholder="Search by patient, doctor or department..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <h2>
          Patients
        </h2>

        <small>
          Last Updated : {lastUpdated}
        </small>

        {loading ? (
          <h3>Loading...</h3>
        ) : (
          patients.map((patient) => (

            <div className="card" key={patient.id}>

              <div className="avatar">
                {patient.patient_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>

              <div className="info">

                <h3>{patient.patient_name}</h3>

                <p><b>Phone:</b> {patient.phone}</p>

                <p><b>Address:</b> {patient.address}</p>

                <p><b>Gender:</b> {patient.gender}</p>

                <p><b>Doctor:</b> {patient.doctor_name}</p>

                <p><b>Department:</b> {patient.department}</p>

                <p>
                  <b>Appointment:</b>{" "}
                  {patient.appointment_date}{" "}
                  {patient.appointment_time}
                </p>

                <p>
                  <b>Registered:</b>{" "}
                  {patient.registered_at}
                </p>

                <button
                  onClick={() => editPatient(patient)}
                >
                  Edit
                </button>

                <button
                  onClick={() => deletePatient(patient.id)}
                >
                  Delete
                </button>

              </div>

            </div>

          ))
        )}

        {/* Pagination */}

        <div className="pagination">

          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>

        </div>

      </div>
    </div>
  );
}

export default App;
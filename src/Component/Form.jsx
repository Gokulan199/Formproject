import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from "react";

const Form = () => {
  const initialFormData = {
    studentId: "", name: "", age: "", email: "", gender: "", number: ""
  };

  const [formData, setFormData] = useState(initialFormData);
  const [users, setUsers] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const validations = {
      studentId: {
        regex: /^@[A-Za-z]{2}[0-9]{7}$/,
        message: "Student ID must be @ + 2 letters + 7 numbers."
      },
      name: {
        condition: formData.name.trim().length < 3,
        message: "Name must be at least 3 characters."
      },
      age: {
        condition: !formData.age || formData.age < 1 || formData.age > 120,
        message: "Age must be between 1 and 120."
      },
      email: {
        regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Enter a valid email."
      },
      gender: {
        condition: !formData.gender,
        message: "Please select a gender."
      },
      number: {
        regex: /^[0-9]{10}$/,
        message: "Phone number must be 10 digits."
      }
    };

    const newErrors = Object.entries(validations).reduce((acc, [field, { regex, condition, message }]) => {
      const failed = regex ? !regex.test(formData[field]) : condition;
      if (failed) acc[field] = message;
      return acc;
    }, {});

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const updatedUsers = [...users];
    if (editIndex !== null) {
      updatedUsers[editIndex] = formData;
      setEditIndex(null);
    } else {
      updatedUsers.push(formData);
    }
    setUsers(updatedUsers);
    setFormData(initialFormData);
  };

  const handleEdit = (index) => {
    setFormData(users[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    setUsers(users.filter((_, i) => i !== index));
  };

  const downloadTextFile = () => {
    if (!users.length) return alert("No user data available to download.");
    
    const blob = new Blob([JSON.stringify(users, null, 2)], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "user_details.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formFields = [
    { label: "Student ID", name: "studentId", type: "text" },
    { label: "Name", name: "name", type: "text" },
    { label: "Age", name: "age", type: "number" },
    { label: "Email", name: "email", type: "email" },
    { label: "Gender", name: "gender", type: "select", options: ["", "Male", "Female", "Other"] },
    { label: "Phone Number", name: "number", type: "tel" }
  ];

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">User Details Form</h2>
      
      <div className="card p-4 shadow-lg mb-4">
        <form onSubmit={handleSubmit}>
          <div className="row">
            {formFields.map((field, i) => (
              <div key={i} className="col-md-6 mb-3">
                <label className="form-label">{field.label}:</label>
                {field.type === "select" ? (
                  <select className="form-select" name={field.name} value={formData[field.name]} onChange={handleChange} required>
                    {field.options.map((opt, j) => (
                      <option key={j} value={opt}>{opt || "Select"}</option>
                    ))}
                  </select>
                ) : (
                  <input type={field.type} className="form-control" name={field.name} 
                    value={formData[field.name]} onChange={handleChange} required />
                )}
                {errors[field.name] && <div className="text-danger small">{errors[field.name]}</div>}
              </div>
            ))}
          </div>
          <button type="submit" className="btn btn-primary w-100">
            {editIndex !== null ? "Update User" : "Add User"}
          </button>
        </form>
      </div>

      <h3 className="text-center mb-3">User Details</h3>
      <div className="card p-4 shadow-lg">
        {users.length ? (
          <>
            <div className="d-none d-lg-block">
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead className="table-dark">
                    <tr>
                      {formFields.map((field, i) => (
                        <th key={i}>{field.label}</th>
                      ))}
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, i) => (
                      <tr key={i}>
                        {formFields.map((field, j) => (
                          <td key={j}>{user[field.name]}</td>
                        ))}
                        <td>
                          <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(i)}>Edit</button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(i)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="d-lg-none">
              {users.map((user, i) => (
                <div key={i} className="card mb-3">
                  <div className="card-body">
                    <h5 className="card-title">{user.name}</h5>
                    {formFields.map((field, j) => (
                      <p key={j} className="card-text"><strong>{field.label}:</strong> {user[field.name]}</p>
                    ))}
                    <div className="d-flex justify-content-end">
                      <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(i)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(i)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : <p className="text-center">No users added yet.</p>}
      </div>

      {users.length > 0 && (
        <button className="btn btn-success mt-3 w-100" onClick={downloadTextFile}>
          Download User Details
        </button>
      )}
    </div>
  );
};

export default Form;
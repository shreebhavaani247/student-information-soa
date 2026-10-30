const cors = require("cors");
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();    
const PORT = process.env.PORT || 3000;
app.use(
  cors({
    origin: [
      "https://ghastly-mummy-jjpg7pwrprjj3jxg-5500.app.github.dev",
      "https://ghastly-mummy-jjpg7pwrprjj3jxg-5501.app.github.dev"
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
  })
);

// Load student records
const studentsPath = path.join(__dirname, "students.json");
const students = JSON.parse(fs.readFileSync(studentsPath, "utf8"));

app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.json({
    service: "Student Information Service",
    description: "A reusable REST API for retrieving student information",
    endpoints: {
      allStudents: "/api/students",
      studentById: "/api/students/STU101"
    }
  });
});

// Retrieve all students
app.get("/api/students", (req, res) => {
  res.json(students);
});

// Retrieve a student by ID
app.get("/api/students/:studentId", (req, res) => {
  const student = students.find(
    (item) =>
      item.studentId.toLowerCase() === req.params.studentId.toLowerCase()
  );

  if (!student) {
    return res.status(404).json({
      error: "Student not found",
      studentId: req.params.studentId
    });
  }

  res.json(student);
});

// Start the service
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Student Information Service running on port ${PORT}`);
});
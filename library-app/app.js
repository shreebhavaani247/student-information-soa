const API_BASE_URL = "https://ghastly-mummy-jjpg7pwrprjj3jxg-3000.app.github.dev";

const studentIdInput = document.getElementById("studentId");
const searchBtn = document.getElementById("searchBtn");
const message = document.getElementById("message");
const studentCard = document.getElementById("studentCard");

function setMessage(text) {
  message.textContent = text;
}

function displayStudent(student) {
  document.getElementById("studentName").textContent = student.name;
  document.getElementById("studentIdLabel").textContent = student.studentId;
  document.getElementById("department").textContent = student.department;
  document.getElementById("year").textContent = `Year ${student.year}`;
  document.getElementById("email").textContent = student.email;

  studentCard.classList.remove("hidden");
}

async function findStudent() {
  const studentId = studentIdInput.value.trim();

  studentCard.classList.add("hidden");
  setMessage("");

  if (!studentId) {
    setMessage("Please enter a student ID.");
    studentIdInput.focus();
    return;
  }

  searchBtn.disabled = true;
  searchBtn.textContent = "Searching...";

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/students/${encodeURIComponent(studentId)}`
    );

    const responseText = await response.text();
    let student;

    try {
      student = JSON.parse(responseText);
    } catch {
      throw new Error(
        `The service returned an invalid response (HTTP ${response.status}). Check the API URL and port visibility.`
      );
    }

    if (!response.ok) {
      throw new Error(
        student.error || "Unable to retrieve student information."
      );
    }

    displayStudent(student);
  } catch (error) {
    setMessage(
      error.message === "Failed to fetch"
        ? "Unable to connect to the Student Information Service. Check that the API is running and port 3000 is accessible."
        : error.message
    );
  } finally {
    searchBtn.disabled = false;
    searchBtn.textContent = "Find Student";
  }
}

searchBtn.addEventListener("click", findStudent);

studentIdInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    findStudent();
  }
});
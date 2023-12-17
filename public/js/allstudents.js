function deleteStudent(studentId) {
    fetch('/delete-student', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ studentId })
    })
    .then(response => response.text())
    .then(message => {
      alert(message);
      location.reload(); 
    })
    .catch(error => console.error('Error deleting student:', error));
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    fetch('/all-students')
      .then(response => response.json())
      .then(students => {
        const allStudentsDiv = document.getElementById('all-students');
  
        students.forEach(student => {
          const card = document.createElement('div');
          card.classList.add('student-card');
  
          card.innerHTML = `
            <p>Name: ${student.name}</p>
            <p>Username (Roll Number): ${student.username}</p>
            <p>Email: ${student.email}</p>
            <p>Phone Number: ${student.phone_number}</p>
            <button onclick="deleteStudent(${student.student_id})">

            <lord-icon
            src="https://cdn.lordicon.com/skkahier.json"
            trigger="hover"
            target="button"
            colors="primary:#ffffff"
            style="width:20px;height:20px">
            </lord-icon>
            </button>
          `;
  
          allStudentsDiv.appendChild(card);
        });
      });
  });
  
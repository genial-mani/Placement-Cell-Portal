document.addEventListener('DOMContentLoaded', () => {
    const allProfilesDiv = document.getElementById('all-profiles');
  
    fetch('/all-students')
      .then(response => response.json())
      .then(students => {
        students.forEach(student => {
          const profileCard = document.createElement('div');
          profileCard.classList.add('profile-card');
  
          profileCard.innerHTML = `
            <h3>${student.name.toUpperCase()}</h3>
            <p><span>Id Number : </span> ${student.username}</p>
            <p><span>Email : </span> ${student.email}</p>
            <p><span>Mobile Number : </span> ${student.phone_number}</p>
          `;
  
          allProfilesDiv.appendChild(profileCard);
        });
      })
      .catch(error => console.error('Error fetching student profiles:', error));
  });
  
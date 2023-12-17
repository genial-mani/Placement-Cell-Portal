document.addEventListener('DOMContentLoaded', () => {
  function formatTimestamp(timestamp) {
    return new Date(timestamp).toLocaleString();
  }
  const allApplicationsDiv = document.getElementById('all-applications');

  fetch('/all-applications')
    .then(response => response.json())
    .then(applications => {
      applications.forEach(application => {
        const card = document.createElement('div');
        card.classList.add('application-card');

        card.innerHTML = `
          <h3>${application.student_name.toUpperCase()}</h3>
          <p>Email: ${application.student_email}</p>
          <p>Resume: ${application.resume_path}</p>
          <p>Position: ${application.job_title}</p>
          <p class='status'>Status: ${application.status}</p>
          <p>Applied at: ${formatTimestamp(application.applied_at)}</p>
          <button class="accept-button" data-status="${application.status}">Accept</button>
          <button class="reject-button" data-status="${application.status}">Reject</button>
        `;

        const acceptButton = card.querySelector('.accept-button');
        const rejectButton = card.querySelector('.reject-button');

        acceptButton.addEventListener('click', () => {
          acceptApplication(application.application_id, acceptButton, rejectButton);
        });

        rejectButton.addEventListener('click', () => {
          rejectApplication(application.application_id, acceptButton, rejectButton);
        });

        updateButtonAppearance(acceptButton, rejectButton, application.status);

        allApplicationsDiv.appendChild(card);
      });
    })
    .catch(error => console.error('Error fetching applications:', error));

  function updateButtonAppearance(acceptButton, rejectButton, status) {
    if (status === 'accepted') {
      acceptButton.innerText = 'Accepted';
      acceptButton.classList.add('accepted');
      rejectButton.classList.add('disabled');
      acceptButton.disabled = true;
      rejectButton.disabled = true;
    } else if (status === 'rejected') {
      rejectButton.innerText = 'Rejected';
      rejectButton.classList.add('rejected');
      acceptButton.classList.add('disabled');
      acceptButton.disabled = true;
      rejectButton.disabled = true;
    }
  }

  function acceptApplication(applicationId, acceptButton, rejectButton) {
    fetch('/accept-application', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ applicationId }),
    })
    .then(response => {
      if (response.ok) {
        alert('Application accepted successfully');
        updateButtonAppearance(acceptButton, rejectButton, 'accepted');
      } else {
        console.error('Error accepting application:', response.statusText);
      }
    })
    .catch(error => console.error('Error accepting application:', error));
  }

  function rejectApplication(applicationId, acceptButton, rejectButton) {
    fetch('/reject-application', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ applicationId }),
    })
    .then(response => {
      if (response.ok) {
        alert('Application rejected successfully');
        updateButtonAppearance(acceptButton, rejectButton, 'rejected');
      } else {
        console.error('Error rejecting application:', response.statusText);
      }
    })
    .catch(error => console.error('Error rejecting application:', error));
  }
});

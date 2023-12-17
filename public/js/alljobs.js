document.addEventListener('DOMContentLoaded', () => {
    fetch('/all-jobs')
      .then(response => response.json())
      .then(jobs => {
        const allJobsDiv = document.getElementById('all-jobs');
  
        jobs.forEach(job => {
          const card = document.createElement('div');
          card.classList.add('job-card');
  
          card.innerHTML = `
            <h3>${job.title}</h3>
            <p>Company: ${job.company_name}</p>
            <p>Type: ${job.type}</p>
            <p>Salary: ${job.salary}</p>
            <p>Description: ${job.description}</p>
            <button class="delete-button" onclick="deleteJob(${job.job_id})">

            <lord-icon
            src="https://cdn.lordicon.com/skkahier.json"
            trigger="hover"
            target="button"
            colors="primary:#ffffff"
            style="width:20px;height:20px">
            </lord-icon>
              Delete
            </button>
          `;
  
          allJobsDiv.appendChild(card);
        });
      });
  
    window.deleteJob = function(jobId) {
      fetch('/delete-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ jobId })
      })
      .then(response => response.text())
      .then(message => {
        alert(message);
        location.reload(); 
      })
      .catch(error => console.error('Error deleting job:', error));
    };
  });
  
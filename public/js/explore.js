document.addEventListener('DOMContentLoaded', () => {
    const exploreAllJobsDiv = document.getElementById('explore-all-jobs');

    fetch('/all-jobs')
        .then(response => response.json())
        .then(jobs => {
            jobs.forEach(job => {
                const card = document.createElement('div');
                card.classList.add('job-card');

                card.innerHTML = `
                    <h3>${job.title}</h3>
                    <p>Company: ${job.company_name}</p>
                    <p>Type: ${job.type}</p>
                    <p>Salary: ${job.salary}</p>
                    <p>Description: ${job.description}</p>
                    <button class="apply-button" data-job-id="${job.job_id}">Apply</button>
                `;

                exploreAllJobsDiv.appendChild(card);

                fetch(`/check-application?job_id=${job.job_id}`)
                    .then(response => response.json())
                    .then(result => {
                        if (result.applied) {
                            const applyButton = card.querySelector('.apply-button');
                            applyButton.innerText = 'Applied';
                            applyButton.disabled = true;
                            applyButton.classList.add('disabled-button');
                        }
                    }) 
                    .catch(error => console.error('Error checking application:', error));
            });

            document.querySelectorAll('.apply-button').forEach(button => {
                button.addEventListener('click', () => {
                    const jobId = button.getAttribute('data-job-id');

                    fetch('/apply-job', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ job_id: jobId }),
                    })
                        .then(response => {
                            if (response.ok) {
                                button.innerText = 'Applied';
                                button.disabled = true; 
                            } else {
                                console.error('Error applying for job:', response.statusText);
                            }
                        })
                        .catch(error => console.error('Error applying for job:', error));
                });
            });
        })
        .catch(error => console.error('Error fetching jobs:', error));
});

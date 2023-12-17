document.addEventListener('DOMContentLoaded', () => {
    const allRecruitersDiv = document.getElementById('all-recruiters');

    fetch('/all-recruiters')
        .then(response => response.json())
        .then(recruiters => {
            const table = document.createElement('table');
            table.classList.add('recruiters-table');
            table.border = '1';

            const headerRow = table.insertRow(0);
            headerRow.innerHTML = '<th>Name</th><th>Company Name</th><th>Email</th><th>Phone Number</th><th>Action</th>';

            recruiters.forEach(recruiter => {
                const row = table.insertRow();
                row.innerHTML = `
                    <td>${recruiter.name}</td>
                    <td>${recruiter.company_name}</td>
                    <td>${recruiter.email}</td>
                    <td>${recruiter.phone_number}</td>
                    <td><button class="delete-recruiter" data-recruiter-id="${recruiter.recruiter_id}">
                    
                    <lord-icon
                        src="https://cdn.lordicon.com/skkahier.json"
                        trigger="hover"
                        target="button"
                        colors="primary:#ffffff"
                        style="width:18px;height:18px">
                    </lord-icon>
                        Remove
                    </button></td>
                `;
            });

            allRecruitersDiv.appendChild(table);
        });

    allRecruitersDiv.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-recruiter')) {
            const recruiterId = event.target.dataset.recruiterId;
            deleteRecruiter(recruiterId);
        }
    });

    function deleteRecruiter(recruiterId) {
        fetch('/delete-recruiter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ recruiterId })
        })
            .then(response => response.text())
            .then(message => {
                alert(message);
                location.reload(); 
            })
            .catch(error => console.error('Error deleting recruiter:', error));
    }
});

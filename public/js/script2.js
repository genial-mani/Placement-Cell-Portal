document.addEventListener('DOMContentLoaded', function () {
    const studentsLink = document.getElementById('studentsLink');
    const studentsDropDown2 = studentsLink.querySelector('.students-drop-down');

    studentsLink.addEventListener('click', function (event) {
        studentsDropDown2.classList.add('classic');
    });
  
});

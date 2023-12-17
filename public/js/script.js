document.addEventListener('DOMContentLoaded', function () {
    const recruitersLink = document.getElementById('recruitersLink');
    const studentsDropDown = recruitersLink.querySelector('.students-drop-down');
    const studentsLink = document.getElementById('studentsLink');
    const studentsDropDown2 = studentsLink.querySelector('.students-drop-down');

    studentsLink.addEventListener('click', function (event) {
        studentsDropDown2.classList.add('classic');
    });
  
    recruitersLink.addEventListener('click', function (event) {
        studentsDropDown.classList.add('classic');
    });
});

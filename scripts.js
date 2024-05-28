document.addEventListener("DOMContentLoaded", function() {
    openSection('about'); // Automatically open the About section on load
});

function openSection(sectionId) {
    var sections = document.querySelectorAll('.section');
    sections.forEach(function(section) {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

function openSlidingPuzzle() {
    document.getElementById('slidingPuzzle').style.display = 'block';
}

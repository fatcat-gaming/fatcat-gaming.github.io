document.addEventListener("DOMContentLoaded", function() {
    const path = window.location.pathname;

    if (path.includes("home")) {
        document.getElementById("homeButton").classList.add("active");
    } else if (path.includes("about")) {
        document.getElementById("aboutButton").classList.add("active");
    } else if (path.includes("contact")) {
        document.getElementById("contactButton").classList.add("active");
    }
});

function myFunction() {
    var element = document.body;
    element.classList.toggle("light-mode");
 };
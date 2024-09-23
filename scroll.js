const projectTitleTag = document.getElementById("projectTitle");
const sections = document.querySelectorAll("main section");
const preloader = document.getElementById("preloader");

function hidePreloader() {
    preloader.style.display = "none";
}

function showPreloader() {
    preloader.style.display = "flex";
}

function handlePreloader() {
    if (!localStorage.getItem('notFirstVisit')) {
        showPreloader();
        setTimeout(() => {
            hidePreloader();
            localStorage.setItem('notFirstVisit', 'true');
        }, 2000);
    } else {
        hidePreloader();
    }
}

// Handle preloader on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    handlePreloader();
});

// Fallback to ensure preloader is hidden
window.addEventListener("load", () => {
    setTimeout(hidePreloader, 100);
});

document.addEventListener("scroll", function () {
    const pixels = window.pageYOffset;
    sections.forEach((section) => {
        if (section.offsetTop - 100 <= pixels) {
            projectTitleTag.innerHTML = section.getAttribute("project");
            projectTitleTag.href = section.getAttribute("page");
            console.log(section.getAttribute("project"));
        }
    });
});

window.addEventListener("load", function () {
    const dynamicHeight = 370 - document.getElementById("projectTitleBox").offsetHeight;
    document.getElementById("margin").style.height = dynamicHeight + "px";
}, false);


//showVidControls[0].addEventListener("mouseover", mouseOver)

// function mouseOver() {
//   console.log("mouseOver")
//   showVidControls[0].setAttribute('controls', '')
// }


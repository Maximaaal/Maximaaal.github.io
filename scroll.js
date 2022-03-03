const projectTitleTag = document.getElementById("projectTitle");
const sections = document.querySelectorAll("main section");
const showVidControls = document.getElementsByClassName("vidControls")

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
  const dynamicHeight = 370 - document.getElementById("projectTitleBox").offsetHeight
  document.getElementById("margin").style.height = dynamicHeight + "px";
  },
  false
);

showVidControls[0].addEventListener("mouseover", mouseOver)

function mouseOver() {
  console.log("mouseOver")
  showVidControls[0].setAttribute('controls', '')
}


const nav = document.querySelector(".nav");
const tree = document.querySelector(".tree");

let scale = 1;

function zoomTree(zoomValue) {
  if (scale < 0.12 || scale > 2 || !zoomValue) scale = 1;
  else scale += zoomValue;
  tree.style.transform = `scale(${scale})`;
}

function navFunctionality(e) {
  const zoomIn = e.target.closest(".fa-search-plus");
  if (zoomIn) {
    zoomTree(0.1);
    return;
  }
  const zoomOut = e.target.closest(".fa-search-minus");
  if (zoomOut) {
    zoomTree(-0.1);
    return;
  }
  const zoomNormal = e.target.closest(".scale-normal");
  if (zoomNormal) {
    zoomTree(0);
    return;
  }
}

export function pageFunctionality() {
  nav.addEventListener("click", navFunctionality);
}

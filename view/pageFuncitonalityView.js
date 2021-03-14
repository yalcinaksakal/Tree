const nav = document.querySelector(".nav");
const tree = document.querySelector(".tree");

let scale = 1;

export function zoomTree(zoomValue) {
  if (scale < 0.03 || !zoomValue) scale = 1;
  else scale += scale <= 0.11 ? zoomValue / 10 : zoomValue;
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

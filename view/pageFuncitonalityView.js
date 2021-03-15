const nav = document.querySelector(".nav");
const tree = document.querySelector(".tree");
const scalableEl = document.querySelector(".scalable");

let scale = 1;

export function zoomTree(zoomValue) {
  if (scale < 0.05 || !zoomValue) {
    tree.style.transform = `scale(1)`;
    scale = Math.min(
      scalableEl.getBoundingClientRect().width / scalableEl.scrollWidth,
      scalableEl.getBoundingClientRect().height / scalableEl.scrollHeight
    );
  } else scale += scale <= 0.11 ? zoomValue / 10 : zoomValue;
  if (zoomValue === 1) scale = 1.03;
  tree.style.transform = `scale(${scale - 0.03})`;
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

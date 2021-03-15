import { remToPx } from "./view/treeView.js";

export function drawLine(start, end) {
  const { width } = start.getBoundingClientRect();
  const ax = +start.style.left.slice(0, -3);
  const ay = +start.style.top.slice(0, -3);
  const bx = +end.style.left.slice(0, -3);
  const by = +end.style.top.slice(0, -3);

  const distance = Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2));
  const angle = (Math.atan2(-ay + by, bx - ax) * 180) / Math.PI;

  //bring all the work together
  const line = document.createElement("div");
  line.classList.add("line");
  line.setAttribute("id", `Line${end.id}`);
  //position
  line.style.position = "absolute";
  line.style.width = distance * remToPx + "px";
  line.style.left = ax * remToPx + width / 2 + "px";
  line.style.top = ay * remToPx + width / 2 + "px";
  //angle
  line.style.transformOrigin = "top left";
  line.style.transform = "rotate(" + angle + "deg)";

  document.querySelector(".tree").appendChild(line);
}

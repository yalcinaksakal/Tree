export function drawLine(start, end) {
  const { width } = start.getBoundingClientRect();
  let ax = +window
    .getComputedStyle(start)
    .getPropertyValue("left")
    .slice(0, -2);

  let ay = +window.getComputedStyle(start).getPropertyValue("top").slice(0, -2);
  let bx, by;
  if (end) {
    bx = +window.getComputedStyle(end).getPropertyValue("left").slice(0, -2);

    by = +window.getComputedStyle(end).getPropertyValue("top").slice(0, -2);
  } else {
    bx = x;
    by = y;
  }
  const distance = Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2));
  const angle = (Math.atan2(-ay + by, bx - ax) * 180) / Math.PI;

  //bring all the work together
  const line = document.createElement("div");
  line.classList.add("line");
  line.setAttribute("id", `${start.id}temp`);

  line.style.position = "absolute";

  line.style.width = distance + "px";
  line.style.left = ax + width / 2 + "px";
  line.style.top = ay + width / 2 + "px";
  line.style.transformOrigin = "top left";

  line.style.transform = "rotate(" + angle + "deg)";
  document.querySelector(".tree").appendChild(line);
}

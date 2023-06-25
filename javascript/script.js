document.addEventListener("DOMContentLoaded", showTopPlayers());

async function showTopPlayers() {
  const response = await fetch("http://localhost:8080/bestPlayers");
  const jsonData = await response.json();

  let playerArray = []
  jsonData.topPlayers.forEach(player => {
    playerArray.push([player.username, Number(player.monthScore)]);
  });
  // console.log(typeof(playerArray));
  playerArray.sort((a, b) => {
    return b[1] - a[1];
  });
  let table = document.getElementById("boardbody");
  for (let i = 0; i < playerArray.length; i++) {
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    th.setAttribute("scope", "row");
    th.innerText = i + 1;
    tr.appendChild(th);
    playerArray[i].forEach((val) => {
      let td = document.createElement("td");
      td.innerText = val;
      tr.appendChild(td);
    });
    table.appendChild(tr);
  }
}
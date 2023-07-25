const blitzOption = document.getElementById("blitz");
blitzOption.addEventListener("change", showTopPlayers);

async function showTopPlayers() {
  
  let tableContainer = document.getElementById("container");
  
  /* Show a spinner */
  let spinner = document.createElement("div");
  spinner.classList.add("spinner-border");
  spinner.classList.add("text-light");
  tableContainer.appendChild(spinner);
  
  const PROD_BASE_URL = "https://bccleaderboard.onrender.com";
  const LOCAL_BASE_URL = "http://localhost:8080";
  
  const response = await fetch(PROD_BASE_URL + "/bestPlayers");
  const jsonData = await response.json();

  /* Remove Spinner and show data */
  tableContainer.removeChild(spinner);

  tableContainer.innerHTML = `
    <table id="board" class="table table-dark text-center table-transparency">
    </table>
  `;
  
  let playerArray = []
  jsonData.topPlayers.forEach(player => {
    playerArray.push([player.username, player.clubScoreMonthAggregate, player.tournamentPointsMonthAggregate, player.tiebreakPointsMonthAggregate]);
  });

  let table = document.getElementById("board");
  table.innerHTML = `
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Player</th>
        <th scope="col">Ranking points</th>
        <th scope="col">TB1</th>
        <th scope="col">TB2</th>
      </tr>
    </thead>
    <tbody id="boardbody">
    </tbody>
  `;
  
  let tableBody = document.getElementById("boardbody");
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
    tableBody.appendChild(tr);
  }
}

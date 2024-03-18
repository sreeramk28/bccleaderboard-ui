const lichessOption = document.getElementById("lichess");
lichessOption.addEventListener("change", show_lichess_top_players);

const chessComOption = document.getElementById("chesscom");
chessComOption.addEventListener("change", show_chesscom_top_players);

const activityOption = document.getElementById("activity");
activityOption.addEventListener("change", show_active_players);

const chessComNoteButton = document.getElementById("chesscom-note");
chessComNoteButton.addEventListener("click", () => {
  alert("Tiebreak points data is not exposed by ChessCom APIs. So, players having equal values of both Ranking points (given by BCC) and TB1 (tournament points aggregate) are ordered randomly. TB2 (tournament tiebreak points aggregate) has to be manually computed from the tournament standings pages to determine the actual order.");
});

const PROD_BASE_URL = "https://bccleaderboard.onrender.com";
const LOCAL_BASE_URL = "http://localhost:8080";
const BEST_PLAYERS_ENDPOINT = "/bestPlayers";
const ACTIVE_PLAYERS_ENDPOINT = "/activePlayers";

const PLATFORM_CHESSCOM = "?platform=chesscom";
const PLATFORM_LICHESS = "?platform=lichess";

function show_active_players() {
  let tableContainer = document.getElementById("container");
  clearElement(tableContainer);
  tableContainer.innerHTML = `
    <form id="activity-form">       
      <div class="mb-3">
        <label for="lichess-tmts" class="form-label text-white">Enter Lichess tournament URLs <button id="lichess-activity-sample" type="button" class="btn btn-link text-white">View Sample</button></label>
        <textarea id="lichess-tmts" class="form-control" rows="5"></textarea>
      </div>
      <div class="mb-3">
        <label for="chesscom-tmts" class="form-label text-white">Enter Chess.com tournament URLs <button id="chesscom-activity-sample" type="button" class="btn btn-link text-white">View Sample</button></label>
        <textarea id="chesscom-tmts" class="form-control" rows="5"></textarea>
      </div>
      <button id="activity-submit" type="button" class="btn btn-primary">Submit</button>
    </form>
  `
  const chessComActivitySampleButton = document.getElementById("chesscom-activity-sample");
    chessComActivitySampleButton.addEventListener("click", () => {
    alert("Enter the URLs separated by commas like below\n\nhttps://www.chess.com/tournament/live/bcc-weekly-blitz-4589002, https://www.chess.com/tournament/live/bcc-weekly-blitz-4560665");
  });
  const lichessActivitySampleButton = document.getElementById("lichess-activity-sample");
    lichessActivitySampleButton.addEventListener("click", () => {
    alert("Enter the URLs separated by commas like below\n\nhttps://lichess.org/tournament/D4yUJIbS, https://lichess.org/swiss/uZD6YJwI, https://lichess.org/tournament/m3L4tGob, https://lichess.org/tournament/yPHNWZTO, https://lichess.org/swiss/yGI0E2uG, https://lichess.org/tournament/TisWvhLp");
  });
  const activitySubmitButton = document.getElementById("activity-submit");
  activitySubmitButton.addEventListener("click", process_active_players);
}

async function process_active_players() {
  let lichessURLs = document.getElementById("lichess-tmts").value;
  let chesscomURLs = document.getElementById("chesscom-tmts").value;
  let lichessQueryParams = lichessURLs.trim().split(" ").join("");
  let chesscomQueryParams = chesscomURLs.trim().split(" ").join("");

  let tableContainer = document.getElementById("container");
  clearElement(tableContainer);

  /* Show a spinner */
  let spinner = get_new_spinner();
  tableContainer.appendChild(spinner);

  
  let chesscom_api_url = PROD_BASE_URL + ACTIVE_PLAYERS_ENDPOINT + PLATFORM_CHESSCOM;
  let lichess_api_url = PROD_BASE_URL + ACTIVE_PLAYERS_ENDPOINT + PLATFORM_LICHESS;

  if (chesscomQueryParams.length > 0) {
    chesscom_api_url += "&urls=" + chesscomQueryParams;
  }

  if (lichessQueryParams.length > 0) {
    lichess_api_url += "&urls=" + lichessQueryParams;
  }

  const chesscom_response = await fetch(chesscom_api_url);
  const chesscom_json_data = await chesscom_response.json();

  const lichess_response = await fetch(lichess_api_url);
  const lichess_json_data = await lichess_response.json();

  /* Remove Spinner and show data */
  tableContainer.removeChild(spinner);

  tableContainer.innerHTML = `
    <table id="board-lichess" class="table table-dark text-center table-transparency">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Lichess Player</th>
          <th scope="col">Participation count</th>
        </tr>
      </thead>
      <tbody id="boardbody-lichess">
      </tbody>
    </table>
    <table id="board-chesscom" class="table table-dark text-center table-transparency">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Chesscom Player</th>
          <th scope="col">Participation count</th>
        </tr>
      </thead>
      <tbody id="boardbody-chesscom">
      </tbody>
    </table>
  `;
  
  show_active_players_data(lichess_json_data, "boardbody-lichess", "board-lichess");
  show_active_players_data(chesscom_json_data, "boardbody-chesscom", "board-chesscom");
}

function show_active_players_data(jsonData, table_body_id, table_id) {
  let tableBody = document.getElementById(table_body_id);
  let table = document.getElementById(table_id);

  if (jsonData.activePlayers == undefined) {
    table.style.display = "none";
    return;
  }
  let playerArray = []
  jsonData.activePlayers.forEach(player => {
    playerArray.push([player.username, player.nbTournamentsPlayed]);
  });
  
  for (let i = 0; i < playerArray.length; i++) {
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    th.setAttribute("scope", "row");
    th.innerText = "*";
    tr.appendChild(th);
    playerArray[i].forEach((val) => {
      let td = document.createElement("td");
      td.innerText = val;
      tr.appendChild(td);
    });
    tableBody.appendChild(tr);
  }

}

function get_new_spinner() {
  let spinner = document.createElement("div");
  spinner.classList.add("spinner-border");
  spinner.classList.add("text-light");
  return spinner;
}

function clearElement(element) {
  element.innerHTML = "";
}

function get_query_params() {
  let params = "";
  for (let i = 1; i <= 5; i++) {
    let eId = "tmt-" + i;
    let url = document.getElementById(eId).value;
    let trimmedUrl = url.trim();
    if (trimmedUrl.length > 0) {
      params += trimmedUrl;
      params += ",";
    }
  }
  return params.slice(0, -1);
}

async function process_chesscom_top_players() {

  let params = get_query_params();
  let apiUrl = PROD_BASE_URL + BEST_PLAYERS_ENDPOINT + PLATFORM_CHESSCOM;

  if (params.length > 0) {
    apiUrl += "&urls=" + params;
  }
  
  let tableContainer = document.getElementById("container");
  clearElement(tableContainer);

  /* Show a spinner */
  let spinner = get_new_spinner();
  tableContainer.appendChild(spinner);

  const response = await fetch(apiUrl);
  const jsonData = await response.json();

  /* Remove Spinner and show data */
  tableContainer.removeChild(spinner);

  tableContainer.innerHTML = `
    <table id="board" class="table table-dark text-center table-transparency">
    </table>
  `;
  show_results(jsonData);

}

async function process_lichess_top_players() {
  let params = get_query_params();
  let apiUrl = PROD_BASE_URL + BEST_PLAYERS_ENDPOINT + PLATFORM_LICHESS;

  if (params.length > 0) {
    apiUrl += "&urls=" + params;
  }
  
  let tableContainer = document.getElementById("container");
  clearElement(tableContainer);

  /* Show a spinner */
  let spinner = get_new_spinner();
  tableContainer.appendChild(spinner);

  const response = await fetch(apiUrl);
  const jsonData = await response.json();

  /* Remove Spinner and show data */
  tableContainer.removeChild(spinner);

  tableContainer.innerHTML = `
    <table id="board" class="table table-dark text-center table-transparency">
    </table>
  `;
  show_results(jsonData);
}

async function show_chesscom_top_players() {
  let tableContainer = document.getElementById("container");
  clearElement(tableContainer);

  tableContainer.innerHTML = `
    <form id="chesscom-form">       
      <div class="mb-3">
        <label for="tmt-1" class="form-label text-white">Enter Chess.com tournament URLs (Sample - https://www.chess.com/tournament/live/bcc-weekly-blitz-4560665)</label>
        <input type="text" id="tmt-1" class="form-control" placeholder="URL 1">
      </div>
      <div class="mb-3">
        <input type="text" id="tmt-2" class="form-control" placeholder="URL 2">
      </div>
      <div class="mb-3">
        <input type="text" id="tmt-3" class="form-control" placeholder="URL 3">
      </div>
      <div class="mb-3">
        <input type="text" id="tmt-4" class="form-control" placeholder="URL 4">
      </div>
      <div class="mb-3">
        <input type="text" id="tmt-5" class="form-control" placeholder="URL 5">
      </div>
      <button id="chesscom-submit" type="button" class="btn btn-primary">Submit</button>
    </form>
  `;

  const chessComSubmitButton = document.getElementById("chesscom-submit");
  chessComSubmitButton.addEventListener("click", process_chesscom_top_players);

}

async function show_lichess_top_players() {
  let tableContainer = document.getElementById("container");
  clearElement(tableContainer);

  tableContainer.innerHTML = `
    <form id="lichess-form">
      <div class="mb-3">
        <label for="tmt-1" class="form-label" style="color:white;">Enter Lichess tournament URLs (Sample - https://lichess.org/swiss/yGI0E2uG)</label>
        <input type="text" id="tmt-1" class="form-control" placeholder="URL 1">
      </div>
      <div class="mb-3">
        <input type="text" id="tmt-2" class="form-control" placeholder="URL 2">
      </div>
      <div class="mb-3">
        <input type="text" id="tmt-3" class="form-control" placeholder="URL 3">
      </div>
      <div class="mb-3">
        <input type="text" id="tmt-4" class="form-control" placeholder="URL 4">
      </div>
      <div class="mb-3">
        <input type="text" id="tmt-5" class="form-control" placeholder="URL 5">
      </div>
      <button id="lichess-submit" type="button" class="btn btn-primary">Submit</button>
    </form>
  `;

  const chessComSubmitButton = document.getElementById("lichess-submit");
  chessComSubmitButton.addEventListener("click", process_lichess_top_players);

}

function show_results(jsonData) {
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

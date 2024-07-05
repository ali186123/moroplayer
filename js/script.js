const content = document.querySelector(".container .content"),
  Playimage = content.querySelector(".music-image img"),
  musicName = content.querySelector(".music-titles .name"),
  musicArtist = content.querySelector(".music-titles .artist"),

  leadId = content.querySelector(".lead-id .result"),
  firstName = content.querySelector(".first-name .result"),
  lastName = content.querySelector(".last-name .result"),
  email = content.querySelector(".email .result"),
  numberDialed = content.querySelector(".number-dialed .result"),
  timeStamp = content.querySelector(".time-stamp .result"),
  campaignName = content.querySelector(".campaign-name .result"),
  listName = content.querySelector(".list-name .result"),
  queueName = content.querySelector(".queue-name .result"),
  recordings = content.querySelector(".recordings .result"),
  address = content.querySelector(".address .result"),
  city = content.querySelector(".city .result"),
  state = content.querySelector(".state .result"),
  postalCode = content.querySelector(".postal-code .result"),
  agentFirstName = content.querySelector(".agent-first-name .result"),
  currentlyInsured = content.querySelector(".currently-insured .result"),
  householdSize = content.querySelector(".household-size .result"),
  ifInsured = content.querySelector(".if-insured .result"),
  losingCoverage = content.querySelector(".losing-coverage .result"),
  income = content.querySelector(".income .result"),
  incomeType = content.querySelector(".income-type .result"),
  preX = content.querySelector(".pre-x .result"),
  pregnant = content.querySelector(".pregnant .result"),
  affordMin150 = content.querySelector(".afford-min-150 .result"),
  age = content.querySelector(".age .result"),

  Audio = document.querySelector(".main-recording"),
  playBtn = content.querySelector(".play-pause"),
  playBtnIcon = content.querySelector(".play-pause span"),
  prevBtn = content.querySelector("#prev"),
  nextBtn = content.querySelector("#next"),
  progressBar = content.querySelector(".progress-bar"),
  progressDetails = content.querySelector(".progress-details"),
  repeatBtn = content.querySelector("#repeat"),
  Shuffle = content.querySelector("#shuffle");

let index = 0;
let leads = [];
const importBtn = document.querySelector("#import");

importBtn.addEventListener("click", () => {
  // Open file dialog
  document.querySelector("#file").click();

  // Handle file import
  document.querySelector("#file").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if(file){
      Papa.parse(file, {
        header: true,
        complete: function(results) {
          const data = results.data;
          leads = data;
          let list = document.querySelector(".recordingsCont");
          // Clear list
          list.innerHTML = "";

          // Group by "Date and Hour"
          const groupedData = data.reduce((acc, item) => {
            const key = item["Date and Hour"].split(" ")[0];
            if (!acc[key]) {
              acc[key] = [];
            }
            acc[key].push(item);
            return acc;
          }, {});

          // convert groupedData to array
          const groupedDataArray = Object.entries(groupedData);

          groupedDataArray.forEach((group) => {
            // Create a list item for each group
            let h2 = document.createElement("h2");
            h2.appendChild(document.createTextNode(group[0]));
            list.appendChild(h2);

            group[1].forEach((item) => {
              // create element and append to list
              // <li> Call Log ID <span class="material-symbols-rounded circular_Shad">play_arrow</span> </li>
              let li = document.createElement("li");
              li.appendChild(document.createTextNode("Lead ID : " + item["Lead ID"]));
              li.setAttribute("data-call-log-id", item["Call Log ID"]);
              let span = document.createElement("span");
              span.appendChild(document.createTextNode("play_arrow"));
              span.classList.add("material-symbols-rounded");
              span.classList.add("circular_Shad");
              span.classList.add("playBtn");
              li.appendChild(span);
              list.appendChild(li);
            });
          });

          // Add event listener to play buttons
          const playBtns = document.querySelectorAll(".playBtn");
          playBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
              if(e.target.innerHTML == "pause"){
                // Pause music
                pauseSong();
                // Change icon to play
                btn.innerHTML = "play_arrow";
              }else{
                // Set all buttons to play
                const leadsList = document.querySelectorAll(".recordingsCont li");
  
                leadsList.forEach((li) => {
                  if(li.getAttribute("data-call-log-id") == leads[index]["Call Log ID"]){
                    li.querySelector("span").innerHTML = "play_arrow";
                  }
                });

                const leadIndex = leads.findIndex((lead) => lead["Call Log ID"] === e.target.parentElement.getAttribute("data-call-log-id"));
                loadData(leadIndex);
                playSong();
                // Change icon to pause
                btn.innerHTML = "pause";
              }
            });
          });
        }
      });
    }
  });
});

function loadData(indexValue) {
  index = indexValue;
    
  indexValue = leads[indexValue];

  if(indexValue["Recordings"].split(" ").length == 1){
    document.querySelector('.popup').style.display = "none";
  }else{
    document.querySelector('.popup').style.display = "block";
  }
  leadId.innerText = indexValue["Lead ID"];
  firstName.innerText = indexValue["First Name"];
  lastName.innerText = indexValue["Last Name"];
  email.innerText = indexValue["Email"];
  numberDialed.innerText = indexValue["Number Dialed"];
  timeStamp.innerText = indexValue["Date and Hour"];
  campaignName.innerText = indexValue["Campaign Name"];
  listName.innerText = indexValue["List Name"];
  queueName.innerText = indexValue["Queue Name"];
  address.innerText = indexValue["Address"];
  city.innerText = indexValue["City"];
  state.innerText = indexValue["State"];
  postalCode.innerText = indexValue["Postal Code"];
  agentFirstName.innerText = indexValue["Agent First Name"];
  currentlyInsured.innerText = indexValue["Currently Insured"];
  householdSize.innerText = indexValue["Household Size"];
  ifInsured.innerText = indexValue["If Insured"];
  losingCoverage.innerText = indexValue["Losing Coverage"];
  income.innerText = indexValue["Income"];
  incomeType.innerText = indexValue["Income Type"];
  preX.innerText = indexValue["Pre-X"];
  pregnant.innerText = indexValue["Pregnant"];
  affordMin150.innerText = indexValue["Afford Min 150"];
  age.innerText = indexValue["Age"];

  if(Audio.src != indexValue["Recordings"].split(" ")[0]){
    Audio.src = indexValue["Recordings"].split(" ")[0];
  }

  const leadsList = document.querySelectorAll(".recordingsCont li");

  leadsList.forEach((li) => {
    if(li.getAttribute("data-call-log-id") == leads[index]["Call Log ID"]){
      li.querySelector("span").innerHTML = "pause";
    }else{
      li.querySelector("span").innerHTML = "play_arrow";
    }
  });
}

playBtn.addEventListener("click", () => {
  const isMusicPaused = content.classList.contains("paused");
  if (isMusicPaused) {
    pauseSong();

    document.querySelector(".recordingsCont li[data-call-log-id='" + leads[index]["Call Log ID"] + "'] span").innerHTML = "play_arrow";
  }
  else {
    if(Audio.src != leads[index]["Recordings"].split(" ")[0]){
      Audio.src = leads[index]["Recordings"].split(" ")[0];
    }

    document.querySelector(".recordingsCont li[data-call-log-id='" + leads[index]["Call Log ID"] + "'] span").innerHTML = "pause";
    loadData(index);
    playSong();
  }
});

function playSong() {
  content.classList.add("paused");
  playBtnIcon.innerHTML = "pause";
  Audio.play();
}

function pauseSong() {
  content.classList.remove("paused");
  playBtnIcon.innerHTML = "play_arrow";
  Audio.pause();
}

nextBtn.addEventListener("click", () => {
  nextSong();
});

prevBtn.addEventListener("click", () => {
  prevSong();
});

function nextSong() {
  index++;
  if (index >= leads.length) {
    index = 0;
  }
  
  loadData(index);
  playSong();
}

function prevSong() {
  index--;
  if (index <= 0) {
    index = leads.length - 1;
  }
  
  loadData(index);
  playSong();
}

Audio.addEventListener("timeupdate", (e) => {
  const initialTime = e.target.currentTime; // Get current music time
  const finalTime = e.target.duration; // Get music duration
  let BarWidth = (initialTime / finalTime) * 100;
  progressBar.style.width = BarWidth + "%";

  progressDetails.addEventListener("click", (e) => {
    let progressValue = progressDetails.clientWidth; // Get width of Progress Bar
    let clickedOffsetX = e.offsetX; // get offset x value
    let MusicDuration = Audio.duration; // get total music duration

    Audio.currentTime = (clickedOffsetX / progressValue) * MusicDuration;
  });

  //Timer Logic
  Audio.addEventListener("loadeddata", () => {
    let finalTimeData = content.querySelector(".final");

    //Update finalDuration
    let AudioDuration = Audio.duration;
    let finalMinutes = Math.floor(AudioDuration / 60);
    let finalSeconds = Math.floor(AudioDuration % 60);
    if (finalSeconds < 10) {
      finalSeconds = "0" + finalSeconds;
    }
    finalTimeData.innerText = finalMinutes + ":" + finalSeconds;
  });

  //Update Current Duration
  let currentTimeData = content.querySelector(".current");
  let CurrentTime = Audio.currentTime;
  let currentMinutes = Math.floor(CurrentTime / 60);
  let currentSeconds = Math.floor(CurrentTime % 60);
  if (currentSeconds < 10) {
    currentSeconds = "0" + currentSeconds;
  }
  currentTimeData.innerText = currentMinutes + ":" + currentSeconds;
});

Audio.addEventListener("ended", () => {
  index++;
  if (index >= leads.length) {
    index = 0;
  }
  loadData(index);
  playSong();
});

document.querySelector('.agent-1').addEventListener('click', () => {
  loadData(index);
  document.querySelector('.title').innerText = "Agent 1";
  Audio.src = leads[index]["Recordings"].split(" ")[0];
  playSong();
});

document.querySelector('.agent-2').addEventListener('click', () => {
  loadData(index);
  //title to Agent 2
  document.querySelector('.title').innerText = "Agent 2";
  Audio.src = leads[index]["Recordings"].split(" ")[1];
  playSong();
});

let playbackrate = 1;

document.querySelector('.faster').addEventListener('click', () => {
  playbackrate += 0.25;
  Audio.playbackRate = playbackrate;
});

document.querySelector('.slower').addEventListener('click', () => {
  playbackrate -= 0.25;
  Audio.playbackRate = playbackrate;
});

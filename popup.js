// Initialize button with user's preferred color
let changeColor = document.getElementById("changeColor");
let changeUser = document.getElementById("currentUser");
let getInfo = document.getElementById("userInfo");
let getDB = document.getElementById("getDbInfo");
let deleteArtist = document.getElementById("delete");

// ************************
// Google tutorial functions
// ************************

// Function to handle the changing of a DOM element
chrome.storage.sync.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color;
});

// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: setPageBackgroundColor,
  });
});

// The body of this function will be executed as a content script inside the
// current page
function setPageBackgroundColor() {
  chrome.storage.sync.get("color", ({ color }) => {
    document.body.style.backgroundColor = color;
  });
}

// ************************
// Ben-added functions
// ************************

// DOM Update
//    Display the currentUser in the popup.html window
chrome.storage.sync.get("currentUser", ({ currentUser }) => {
  changeUser.textContent = currentUser;
});


// Event Listener
//    Event: "userInfo" button is clicked
//    Action: fetch user info from web page (followers, track count, etc.)
getInfo.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let currentUser = await chrome.storage.sync.get("currentUser");

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: getArtistInfo,
    args: [currentUser]
  });
});


// Event Listener
//    Event: "getDB" button is clicked
//    Action: Get all records from database from "getDbInfo" click
//    Status: FAILING
getDB.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: getDbData,
  });
});

/** * * *
 * Event Listener
 * ...
 * Event: "delete" button clicked
 * Action: Remove current Artist from DB
 * Status: ?
 */
deleteArtist.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let currentUser = await chrome.storage.sync.get("currentUser");

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: removeArtist,
    args: [currentUser]
  });
});


// Message Listener
//    Event: background.js sends message informing popup.js that the database is created
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ? "from a Content Script:" + sender.tab.url : "from the Extension");
    console.log(request);
    console.log(sender);

    if (request.greeting === "created-db") {
      console.log("Received 'dbinfo'");
      sendResponse({farewell: "okay, got it."});
    }
    
  }
);


// :: :: :: :: :: :: :: :: :: :: :: ::
// :: :: :: :: :: :: :: :: :: :: :: ::
// Auxilliary functions
// :: :: :: :: :: :: :: :: :: :: :: ::
// :: :: :: :: :: :: :: :: :: :: :: ::

function getDbData() {
  console.log("trying to get database data...");
  // Send a message to the service worker
  chrome.runtime.sendMessage({name: "dbinfo"}, (response) => {
    console.log(response);
    return true;
  });
}

/**
 * Sends a message to service worker to remove the current artist from the database.
 */
function removeArtist(currentUser) {
  console.log("trying to remove artist...");

  chrome.runtime.sendMessage({name: "delete", artist: currentUser.currentUser}, (response) => {
    console.log(response);
    return true;
  });
}

// getArtistInfo()
//  :: Fetch artist info from webpage, build new object, and send to background.js for database.
// Info
//  :: uid, name, info stats (followers, etc.), date added, flags (messaged, fan, etc.), categories
function getArtistInfo(currentUser) {
  let artistObject = {};

  // TODO: Set UID from currentUser
  artistObject.uid = currentUser.currentUser;

  // Set name
  artistObject.name = document.body.getElementsByClassName("profileHeaderInfo__userName")[0].textContent.trim()

  // Set artist stats (followers, following, track count)
  let infoStatsDOM = document.body.getElementsByClassName("infoStats__stat");
  artistObject.followers = Number(infoStatsDOM[0].getElementsByClassName("infoStats__value")[0].textContent);
  artistObject.following = Number(infoStatsDOM[1].getElementsByClassName("infoStats__value")[0].textContent);
  artistObject.track_count = Number(infoStatsDOM[2].getElementsByClassName("infoStats__value")[0].textContent);

  // Set date_added
  artistObject.date_added = (new Date()).toLocaleDateString('en-US');

  // init flags as false for now (messaged, fan, collabo)
  artistObject.messaged = false;
  artistObject.fan = false;
  artistObject.collabo = false;

  // init categories as empty (for now)
  artistObject.categories = [];

  console.log(artistObject);

  // Send message to database
  chrome.runtime.sendMessage({name: "insert", insertObj: artistObject}, (response) => {
    console.log(response);
    return true;
  });

  // const dbOpenRequest = indexedDB.open("ScatmanDB");

  // dbOpenRequest.onerror = (event) => {
  //   console.log("Error opening the database.");
  //   console.log(event);
  // }

  // dbOpenRequest.onsuccess = (event) => {
  //   console.log("Database initialized.");

  //   // Store the result of opening the database in a db variable
  //   const db = event.target.result;
    
  //   console.log(db);

  //   // insert data here
  //   const addTransaction = db.transaction(["artists"], "readwrite");
  //   const objectStore = addTransaction.objectStore("artists");
  //   const request = objectStore.add(artistObject);

  //   request.onerror = (event) => {
  //     console.log("error adding artist");
  //   }

  //   request.onsuccess = (event) => {
  //     console.log("successfully added artist: " + artistObject.uid);
  //   }
  // }

  // dbOpenRequest.onupgradeneeded = (event) => {
  //   let db = event.target.result;
  //   console.log("Upgrade needed, boi!");
  // }
}
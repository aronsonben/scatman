// background.js

let color = '#3aa757';
let currentUser = 'tio574';
let db = null;
let artists = [
  {
    'uid': 'tio500',
    'name': 'fake tio benito',
    'followers': 123,
    'following': 542,
    'track_count': 9,
    'date_added': 'Mon, Sep 12, 2022',
    'categories': []
  },
  {
    'uid': 'tio999',
    'name': 'tito benito',
    'followers': 3000,
    'following': 44,
    'track_count': 99,
    'date_added': 'Mon, Sep 12, 2022',
    'categories': ['sicknasty']
  },
  {
    'uid': 'tio32',
    'name': 'ito',
    'followers': 9,
    'following': 444,
    'track_count': 0,
    'date_added': 'Mon, Sep 12, 2022',
    'categories': [],
    'isFan': true,
    'isSuperFan': false,
    'collabo': false
  }
];

// Database Information
const dbName = "ScatmanDB";
const artistData = [
  {
    'uid': 'tio',
    'name': 'Fake Tio Benito',
    'followers': 123,
    'following': 542,
    'track_count': 9,
    'date_added': 'Mon, Sep 12, 2022',
    'messaged': true,
    'fan': false,
    'collabo': true,
    'categories': ['boombap', 'lofi']
  },
  {
    'uid': 'ben',
    'name': 'Ben Aronson',
    'followers': 400,
    'following': 45,
    'track_count': 91,
    'date_added': 'Mon, Sep 12, 2022',
    'messaged': true,
    'fan': true,
    'collabo': false,
    'categories': ['trap', 'crazy']
  },
  {
    'uid': 'ito',
    'name': 'Squito',
    'followers': 10000,
    'following': 1,
    'track_count': 1,
    'date_added': 'Mon, Sep 12, 2022',
    'messaged': false,
    'fan': false,
    'collabo': false,
    'categories': []
  }
]

// ::
// Copying from https://anobjectisa.com/?p=105
// ::
function create_database() {
  const request = indexedDB.open(dbName);

  request.onerror = function (event) {
    console.log("Problem opening DB.");
  }

  request.onupgradeneeded = function (event) {
    db = event.target.result;

    let objectStore = db.createObjectStore('artists', {
      keyPath: 'uid',
    });

    objectStore.transaction.oncomplete = function (event) {
      console.log("ObjectStore Created.");
    }
  }

  request.onsuccess = function (event) {
    db = event.target.result;
    console.log("DB OPENED.");
    insert_records(artists);

    db.onerror = function (event) {
      console.log("FAILED TO OPEN DB.")
    }
  }
}

function insert_records(artists) {
  if (db) {
    const insert_transaction = db.transaction("artists", "readwrite");
    const objectStore = insert_transaction.objectStore("artists");

    return new Promise((resolve, reject) => {
      insert_transaction.oncomplete = function () {
        console.log("ALL INSERT TRANSACTIONS COMPLETE.");
        resolve(true);
      }

      insert_transaction.onerror = function () {
        console.log("PROBLEM INSERTING RECORDS.")
        resolve(false);
      }

      artists.forEach(artist => {
        let request = objectStore.add(artist);

        request.onsuccess = function () {
          console.log("Added: ", artist);
        }
      });
    });
  }
}

function get_record(uid) {
  console.log("Getting record for: ", uid);
  if (db) {
    const get_transaction = db.transaction("artists", "readonly");
    const objectStore = get_transaction.objectStore("artists");

    return new Promise((resolve, reject) => {
      get_transaction.oncomplete = function () {
        console.log("ALL GET TRANSACTIONS COMPLETE.");
      }

      get_transaction.onerror = function () {
        console.log("PROBLEM GETTING RECORDS.")
      }

      let request = objectStore.get(uid);

      request.onsuccess = function (event) {
        resolve(event.target.result);
      }
    });
  }
}

function update_record(record) {
  if (db) {
    const put_transaction = db.transaction("artists", "readwrite");
    const objectStore = put_transaction.objectStore("artists");

    return new Promise((resolve, reject) => {
      put_transaction.oncomplete = function () {
          console.log("ALL PUT TRANSACTIONS COMPLETE.");
          resolve(true);
      }

      put_transaction.onerror = function () {
          console.log("PROBLEM UPDATING RECORDS.")
          resolve(false);
      }

      objectStore.put(record);
    });
  }
}

function delete_record(uid) {
  if (db) {
    const delete_transaction = db.transaction("artists", 
    "readwrite");
    const objectStore = delete_transaction.objectStore("artists");

    return new Promise((resolve, reject) => {
      delete_transaction.oncomplete = function () {
          console.log("ALL DELETE TRANSACTIONS COMPLETE.");
          resolve(true);
      }

      delete_transaction.onerror = function () {
          console.log("PROBLEM DELETE RECORDS.")
          resolve(false);
      }

      objectStore.delete(uid);
    });
  }
}

function get_all_records() {
  console.log("Getting all records");
  if (db) {
    const get_transaction = db.transaction("artists", "readonly");
    const objectStore = get_transaction.objectStore("artists");

    return new Promise((resolve, reject) => {
      get_transaction.oncomplete = function () {
        console.log("ALL GET TRANSACTIONS COMPLETE.");
      }

      get_transaction.onerror = function () {
        console.log("PROBLEM GETTING RECORDS.")
      }

      let request = objectStore.getAll();

      request.onsuccess = function (event) {
        console.log("got all records successfully");
        resolve(event.target.result);
      }
    });
  }
}

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// End IndexedDB work
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


function create_db() {
  const dbOpenRequest = indexedDB.open(dbName, 1);

  return new Promise((resolve, reject) => {
    dbOpenRequest.onerror = (event) => {
      console.log("Error opening the database.");
      console.log(event);
      resolve(false);
    }
  
    dbOpenRequest.onsuccess = (event) => {
      console.log("Database initialized.");
  
      // Store the result of opening the database in a db variable
      db = dbOpenRequest.result;
      
      // Add initial test values to database
      var insertRequest = insert_db(artistData)
        .catch((error) => {
          console.log("Error inserting test values (create_db)");
          resolve(false);
        })
        .then((data) => {
          console.log("Successfully inserted test values (create_db)");
          resolve(true);
        });
  
      // Run the displayData() function to populate the artist list with 
      // temporary data for testing purposes (tutorial)
      // TODO: Send a message to popup.js that displays database data
      // displayData();
    }
  
    // This event handles the case whereby a new version 
    // of the db needs to be created. Either because:
    // - one has not been created before, or
    // - a new version number has been submitted to the 'open()' method
    dbOpenRequest.onupgradeneeded = (event) => {
      db = event.target.result;
  
      db.onerror = (event) => {
        console.log("Error opening the database.");
      }
  
      // Create an object store for this database
      const objectStore = db.createObjectStore("artists", { 
        keyPath: "uid"
      });
  
      // define what data items the objectStore will contain
      objectStore.createIndex("name", "name", { unique: false });
      objectStore.createIndex("followers", "followers", { unique: false });
      objectStore.createIndex("following", "following", { unique: false });
      objectStore.createIndex("track_count", "track_count", { unique: false });
      objectStore.createIndex("date_added", "date_added", { unique: false });
      objectStore.createIndex("messaged", "messaged", { unique: false });
      objectStore.createIndex("fan", "fan", { unique: false });
      objectStore.createIndex("collabo", "collabo", { unique: false });
      objectStore.createIndex("categories", "categories", { unique: false, multiEntry: true });
  
      console.log("'artists' object store created.");
    }
  });
}

function insert_db(data) {
  if (db) {
    // This opens up a transaction on the database, then opens an object store that we can manipulate the data inside of
    const insertTransaction = db.transaction('artists', 'readwrite');
    const objectStore = insertTransaction.objectStore('artists');

    console.log("INSERTING: ", data);

    return new Promise((resolve, reject) => {
      insertTransaction.onerror = (event) => {
        console.log("Error adding data to db.");
        resolve(false);
      }
  
      insertTransaction.oncomplete = (event) => {
        console.log("Successfully added data to db.");
        resolve(true);
      }
  
      data.forEach((artist) => {
        const addRequest = objectStore.add(artist);
        // addRequest.onsuccess = (event) => {
        //   console.log("Added new object (" + event.target.result + "), (" + artist.uid + ")");
        // }
      });
    });
  }
}

function get_all() {
  if (db) {
    const getTransaction = db.transaction('artists');
    const objectStore = getTransaction.objectStore('artists');
    const request = objectStore.getAll();

    return new Promise((resolve, reject) => {
      request.onerror = (event) => {
        console.log("Failed to retrieve all records from database.");
        resolve(false);
      }
  
      request.onsuccess = (event) => {
        console.log("Successfully fetched all records from database.");
        let records = request.result;
        resolve(records);
      }
    });
  }
}

function delete_db() {
  var req = indexedDB.deleteDatabase(dbName);
  req.onsuccess = function () {
      console.log("Deleted database successfully");
  };
  req.onerror = function () {
      console.log("Couldn't delete database");
  };
  req.onblocked = function () {
      console.log("Couldn't delete database due to the operation being blocked");
  };
}


// ============================================================================
// ============================================================================


// Change to true if I want to delete database and start fresh (?)
let freshStart = true;

// Event Listener
//  Event: Extension is installed to browser
//  Actions: Create initial (test) database
//  Status: SUCCESS
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  chrome.storage.sync.set({ currentUser });
  console.log('Default background color set to %cgreen', `color: ${color}`);
  console.log('Default currentUser set to ', `user: ${currentUser}`);

  if (freshStart)
    delete_db();


  create_db();
});

// Event Listener
//  Event: user's tab is updated
//  Action: Update currentUser if tab is a soundcloud link
//  Status: SUCCESS
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && changeInfo.url.includes("soundcloud.com")) {
    let currentUser = changeInfo.url.split("/")[3];
    chrome.storage.sync.set({ currentUser });
    console.log('Changed currentUser to ', `user: ${currentUser}`);
  }
});

// Message Listener
//  Event: popup.js sends message requesting database info 
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.name === "dbinfo") {
      console.log("Received 'dbinfo'");

      get_all().then((data) => {
        console.log(data);
        sendResponse({artists: data});
      });
      return true;
    }

    if (message.name === "insert") {
      console.log("Received 'insert'");
      insert_db([message.insertObj]).then((data) => {
        console.log("Added artist");
        sendResponse({resp: data});
      })
      return true;
    }
  }
);
// background.js

let color = '#3aa757';
let currentUser = '';
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


// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// Ben's IndexedDB 
/**
 * create_db(): creates the entire database upon install
 * 
 * insert_db(): inserts specified records into db
 * 
 * remove_db(): removes a specified record from the db
 * 
 * update_db(): updates specified record in db
 * 
 * get_all(): gets all records from db
 * 
 * get_record(): gets a single record from the db
 * 
 * delete_db(): completely wipes db [DEV only]
 * 
 **/
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

function remove_db(data) {
  if(db) {
    const insertTransaction = db.transaction('artists', 'readwrite');
    const objectStore = insertTransaction.objectStore('artists');

    console.log("DELETING: ", data);

    return new Promise((resolve, reject) => {
      insertTransaction.onerror = (event) => {
        console.log("Error removing data from db.");
        resolve(false);
      }
  
      insertTransaction.oncomplete = (event) => {
        console.log("Successfully removed data to db.");
        resolve(true);
      }
  
      data.forEach((uid) => {
        console.log(uid);
        const deleteRequest = objectStore.delete(uid);
        // addRequest.onsuccess = (event) => {
        //   console.log("Added new object (" + event.target.result + "), (" + artist.uid + ")");
        // }
      });
    });
  }
}

function update_db(data) {
  if (db) {
    const insertTransaction = db.transaction('artists', 'readwrite');
    const objectStore = insertTransaction.objectStore('artists');
    const request = objectStore.get(uid);

    console.log("UPDATING: ", data);

    return new Promise((resolve, reject) => {
      insertTransaction.onerror = (event) => {
        console.log("Error updating data in db.");
        resolve(false);
      }
  
      insertTransaction.oncomplete = (event) => {
        console.log("Successfully updated data in db.");
        resolve(true);
      }
  
      const artist = request.result;
      // artist.name = data.newname

      const updateRequest = objectStore.put(uid);
      requestUpdate.onerror = (event) => {
        // Do something with the error
        console.log("Error updating this single artist");
      };
      requestUpdate.onsuccess = (event) => {
        // Success - the data is updated!
        console.log("Successfully updated this single artist");
      };
    });
  }
}

function get_record(uid) {
  if (db) {
    const getTransaction = db.transaction('artists');
    const objectStore = getTransaction.objectStore('artists');
    const request = objectStore.get(uid);

    return new Promise((resolve, reject) => {
      request.onerror = (event) => {
        console.log("Failed to retrieve records from database.");
        resolve(false);
      }
  
      request.onsuccess = (event) => {
        console.log("Successfully fetched record from database.");
        let record = request.result;
        resolve(record);
      }
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
  // chrome.storage.sync.set({ currentUser });
  console.log('Default background color set to %cgreen', `color: ${color}`);
  // console.log('Default currentUser set to ', `user: ${currentUser}`);

  if (freshStart)
    delete_db();


  create_db();
});

// Event Listener
//  Event: user's tab is updated
//  Action: Update currentUser if tab is a soundcloud link
//  Status: SUCCESS
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  get_user(tab);
});

/** * * *
 * Event Listener
 * ...
 * Event: user switches to a new tab
 * Action: Get currentUser, if applicable
 * Status: SUCCESS
 */
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, ((tab) => {
    get_user(tab);
  }));
});

/**
 * Auxilliary function to get current user from tab info
 */
function get_user(tab) {
  if (tab.url && tab.url.includes("soundcloud.com")) {
    let currentUser = tab.url.split("/")[3];
    chrome.storage.sync.set({ currentUser });
    console.log('Changed currentUser to ', `user: ${currentUser}`);
  }
}

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

    if (message.name === "delete") {
      console.log("Received 'delete'");
      remove_db([message.artist]).then((data) => {
        console.log("Deleted artist");
        sendResponse({resp: data});
      })
      return true;
    }
  }
);


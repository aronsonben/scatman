# Development Notes


### 9/21/22:

ToDo:
1. Fix insert:
  1. ✅ Correct uid (can't be null, must equal URL)
  2. ✅ Add stats as numbers, not strings
  3. Check if already exists
2. ✅ Delete artists from db
  - Note: Current delete does no checks to make sure it makes sense
3. Store database
4. Update artist in db (test existing function)
5. Display db info in UI


### 9/15/22:

Successfully created & fetched all test data from the database! 
- background.js
- popup.js

Next, add CRUD operations:
1. Add new artist to db ✅
2. Delete from db
3. Update in db

Final Update: Just barely made this happen, scrapped together a (probably wrong)
implementation of an insert transaction. 

#### 1. Add new artist needs:
```
  - uid           // get from sc user
  - name          // getArtistInfo()
  - followers     // getArtistInfo()
  - following     // getArtistInfo()
  - track_count   // getArtistInfo()
  - date_added    // new Date()
  - messaged      // boolean, init with false
  - fan           // boolean, init with false
  - collabo       // boolean, init with false
  - categories    // boolean, init with false
```

"Add Artist" will be initiated by a button click, which will create an artist 
object (as in getArtistInfo()). That will be sent back to background.js, which
will add it to the db.


### 9/12/22:

#### Completed Today:
- Created an initial Artist object
- Going with IndexedDB over local storage, I guess?

#### Database Objects

Saving an Artist to the database:
```
Artist:
- ID                (soundcloud URL)
- Name
- Location?
- Date Found
- Followers
- Following
- WillFollow        (has more following than followers)
- Track Count
- Categories        (list) (many-to-one)
- Last Comment?
- Bio?
- Groups?           (eventually, be able to add Artist to user-created groups)
- Messages          (# of messages sent, user action)
- MessageReplied    (mark if conversation started)
- CollabTarget      (marked as someone to collab with)
- Collabo           (collabo happened)
- Artist Watch      (marked as an artist to watch)
- IsFan             (mark if artist has liked my songs before)
- SuperFan          (mark if artist has liked multiple of my songs)
```


### 9/9/22:

#### #1
Attempting to store user object in database. Exploring options:
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Basic_Terminology#database)
- [local storage](https://developer.chrome.com/docs/extensions/reference/storage/#property-local)


#### #2
Attempting to add ability to get current SoundCloud user from current URL.
✅ Achieved.

Files affected:
```
background.js     // added new storage variable      
popup.html        // displays currentUser
```


### 9/6/22:

Followed Google's [Chrome Extension Development tutorial](https://developer.chrome.com/docs/extensions/mv3/getstarted/) to get basic extension running.

Files added:
```
manifest.json // all-important file
background.js // storing key information
popup.js      // popup interactivity
options.js    // options iteractivity
popup.html    // popup ui
options.html  // options ui
button.css    // styling for popup
images/       // assets
```

# Goals

- [ X ] Get active tab's user
- [ ] Save current user to storage
- [ ] Save current user as "Sent a message"
- [ ] Save current user as "Collab target"
- [ ] Save current user as "Artist watch"
- [ X ] Get an artist's follower & track count
- [ ] Find an artist's last comment

### Overall Goal:

I want to implement three main things:

- A&R Discocat - When I find a cool artist, add them to a database by marking when I first discovered them and how many followers they had

- SoundCloud Interactor - Keep track of which artists I wrote a message to for promo, which replied, which I should collaborate with, and which I should highlight

- SoundCloud Network Graph - Categorize artists based off interactions, sounds/genre, groups, collectives, etc. Build a Civ IV-type graph of who is connected
var db;

//TODO validar sempre se eh necessario resetar
var restoreDB = true; // true/false - reset and import

$( document ).ready(function() {
	document.addEventListener("deviceready", function () {
		if( restoreDB && window.indexedDB.deleteDatabase("RodrigoFisio"))
			console.log('Database was dropped successfully!')

		var request = window.indexedDB.open("RodrigoFisio", 1); //with version

		//prefixes of implementation that we want to test
		window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
		 
		//prefixes of window.IDB objects
		window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
		window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
		 
		if (!window.indexedDB) {
			window.alert("Your browser doesn't support a stable version of IndexedDB.")
		}
		 
		request.onerror = function(event) {
		  console.error("error: ", event);
		};
		 
		request.onsuccess = function(event) {
		  db = request.result;
		  console.debug("success: "+ db);

		  if( restoreDB ) {
			  createFreeTime(db);
			  loadCustomerFromBackup(db);
			  loadScheduledTimeFromBackup(db);
			  loadBlockedTimeFromBackup(db);
		  }
		};

		request.onupgradeneeded = function(event) {
				var db = event.target.result;
				var customertStore = db.createObjectStore("customer", {keyPath: "id", autoIncrement: true});
				customertStore.createIndex("customerEmail", "customerEmail");

				var scheduledTimeStore = db.createObjectStore("scheduledTime", {keyPath: "id", autoIncrement: true});
				scheduledTimeStore.createIndex("date", "date", { unique: false });
				scheduledTimeStore.createIndex("time", "time", { unique: false });

				var freeTimeStore = db.createObjectStore("freeTime", {keyPath: "id", autoIncrement: true});
				freeTimeStore.createIndex("date", "date", { unique: false });
				freeTimeStore.createIndex("time", "time", { unique: false });

				var blockedTimeStore = db.createObjectStore("blockedTime", {keyPath: "id", autoIncrement: true});
				blockedTimeStore.createIndex("date", "date", { unique: false });
				blockedTimeStore.createIndex("time", "time", { unique: false });
		}

		/*dowanloadDatabase = function(database) {
			var fileURL = cordova.file.dataDirectory + 'testerodrigo.gif';
			//var fileURL = 'cdvfile://localhost/persistent/teste.json';
			var uri = encodeURI("https://49.media.tumblr.com/b9f6d8d738b6da97541f5cbdcb0e8ab5/tumblr_o5w2roswuy1ukldkho1_400.gif");

			var fileTransfer = new FileTransfer();

			fileTransfer.download(
				 uri,
				 fileURL,
				 function(entry) {
					  alert("download complete: " + fileURL + " - " + entry.toURL());
				 },
				 function(error) {
					  alert("upload error code " + error.code);
				 },
				 false,
				 {
					  headers: {}
				 }
			);

		}*/
		dowanloadDatabase = function(database) {
			var xhr = new XMLHttpRequest();
			xhr.open('GET', 'http://cordova.apache.org/static/img/cordova_bot.png', true);
			xhr.responseType = 'blob';

			xhr.onload = function() {
			  if (this.status == 200) {
					alert('status 200');
					var blob = new Blob([this.response], { type: 'image/png' });


					saveFile(cordova.file.dataDirectory, blob, "testerodrigo.png");
			  }
			};
			xhr.send();
		}

		saveFile = function (dirEntry, fileData, fileName) {
			alert('direntry ' + dirEntry + ' file ' + fileData + ' name ' + fileName );
			window.resolveLocalFileSystemURL(dirEntry, function(dir) {
				  alert("got main dir", dir);
				  dir.getFile(fileName, { create: true, exclusive: false }, function (fileEntry) {
					  alert('sucesso parcial');
					  writeFile(fileEntry, fileData, false);
				 }, function(e) {
					alert('error ' + e)
				 });
			 });

			 
		}

      writeFile = function (fileEntry, dataObj, isAppend) {
		    alert('file entry ' + fileEntry + ' data ' + dataObj + ' ap' + isAppend);
			 fileEntry.createWriter(function (fileWriter) {
				  fileWriter.onwriteend = function() {
				      alert("Successful file write..." + fileEntry);

				      if (dataObj.type == "image/png") {
				          readBinaryFile(fileEntry);
				      }
				      else {
				          readFile(fileEntry);
				      }
				  };

				  fileWriter.onerror = function(e) {
				      alert("Failed file write: " + e.toString());
				  };
				  fileWriter.write(dataObj);
			 });
		}

		loadDatabase = function(database, callback) {
			$.getJSON('https://raw.githubusercontent.com/contato-alantiel/agenda/master/data/' + database + '.json?r=' + Math.random(), 
			function(data) 
			{
				callback(data[database]);
	
				if(database === 'customers' ) // testando
					dowanloadDatabase(database);
			});
		}

		loadCustomerFromBackup = function(db) {
			loadDatabase('customers', function(customers) {
				var customertStore = db.transaction(["customer"], "readwrite")
				    .objectStore("customer")
				for(i=0; i<customers.length; i++) {
					customertStore.add(customers[i]);
				}
			});
		}

		loadScheduledTimeFromBackup = function(db) {
			loadDatabase('scheduledTimes', function(scheduledTimes) {
				var scheduledTimeStore = db.transaction(["scheduledTime"], "readwrite")
				    .objectStore("scheduledTime");

				for(i=0; i<scheduledTimes.length; i++) {
					// deleting freeTime
					deleteFreeTime(db, scheduledTimes[i].date);
					scheduledTimeStore.add(scheduledTimes[i]);
				}
			});
		}

		loadBlockedTimeFromBackup = function(db) {
			loadDatabase('blockedTimes', function(blockedTimes) {
				var blockedTimesStore = db.transaction(["blockedTime"], "readwrite")
				    .objectStore("blockedTime");

				for(i=0; i<blockedTimes.length; i++) {
					// deleting freeTime
					deleteFreeTime(db, blockedTimes[i].date);
					blockedTimesStore.add(blockedTimes[i]);
				}
			});
		}

		createFreeTime = function(db, n = 10) {
			var freeTimeStore = db.transaction(["freeTime"], "readwrite")
				    .objectStore("freeTime");

			var startDate = new Date();
			startDate.setHours(0);
		
			for(i = 0; i<n; i++) {
				var d = new Date(startDate);
				d.setDate(startDate.getDate() + i);

				for(j = 6; j<=22; j++) {
					var currentPad = j.toString().padStart(2, "0");
					var nextPad = (j+1).toString().padStart(2, "0");
					objFree = {"date": prefix(d) + currentPad, "time": currentPad + "-" + nextPad};
					freeTimeStore.add(objFree);
				}
			}
		}

		deleteFreeTime = function(db, date) {
			var freeTimeStore = db.transaction(["freeTime"], "readwrite")
				    .objectStore("freeTime");

			freeTimeStore.index('date').openCursor(IDBKeyRange.only(date), 'next').onsuccess = function(event) {
				 var cursor = event.target.result;
				 if (cursor) {
					freeTimeStore.delete(cursor.value.id);
					cursor.continue();
				 }
			};
		}

		prefix = function(d) {
			return d.toISOString().slice(0,10).replace(/-/g,""); //yyyymmdd
		}
	});
});

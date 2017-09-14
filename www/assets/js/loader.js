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

		cordova.file.writeTextToFile = function(params, callback) {
		  window.resolveLocalFileSystemURL(params.path, function(dir) {
			 dir.getFile(params.fileName, {create:true}, function(file) {
				if(!file) return callback.error('dir.getFile failed')
				file.createWriter(
				  function(fileWriter) {
				    if (params.append == true) fileWriter.seek(fileWriter.length)
				    var blob = new Blob([params.text], {type:'text/plain'})
				    fileWriter.write(blob)
				    callback.success(file)
				  },
				  function(error) {
				    callback.error(error)
				  }
				)
			 })
		  })
		}

		cordova.file.readJSONFromFile = function(params, callback) {
		  window.resolveLocalFileSystemURL(params.path, function(dir) {
			 dir.getFile(params.fileName, {create:false}, function(fileEntry) {
				if(!fileEntry) return callback.error('dir.getFile failed')

				fileEntry.file(function (file) {
					var reader = new FileReader();
					reader.onloadend = function() {
						callback.success(JSON.parse(this.result));
					};

					reader.readAsText(file); //trigger to get file content

				}, function() { alert('error') });
				
			 })
		  })
		}

		readLocalDatabase = function(database) {
			cordova.file.readJSONFromFile({
				 path: cordova.file.externalDataDirectory,
				 fileName: 'rodrigo-agenda-' + database + '.json'
			  },
			  {
				 success: function(content) {
					callback(content[database]);
				 },
				 error: function(error) {
					alert('Erro na leitura: ' + error)
				 }
			 });
		}

		backupDatabase = function(data, database) {
			cordova.file.writeTextToFile({
				 text:  JSON.stringify(data[database]),
				 path: cordova.file.externalDataDirectory,
				 fileName: 'rodrigo-agenda-' + database + '.json',
				 append: false
			  },
			  {
				 success: function(file) {
					alert('Backup concluido: ' + file.nativeURL);
				 },
				 error: function(error) {
					alert('Erro no processo de backup: ' + error)
				 }
			  }
			);

		}

		loadDatabase = function(database, callback, offline = false) {
			if(offline) {
				readLocalDatabase(database, callback);				
			} else {
				$.getJSON('https://raw.githubusercontent.com/contato-alantiel/agenda/master/data/' + database + '.json?r=' + Math.random(), 
				function(data) 
				{
					callback(data[database]);
					backupDatabase(data, database);
				});
			}
		}

		loadCustomerFromBackup = function(db, offline = false) {
			loadDatabase('customers', function(customers) {
				var customertStore = db.transaction(["customer"], "readwrite")
				    .objectStore("customer")
				alert("customers " + customers);
				alert("JSON.stringify customers " + JSON.stringify(customers));
				for(i=0; i<customers.length; i++) {
					customertStore.add(customers[i]);
				}
			}, offline);
		}

		loadScheduledTimeFromBackup = function(db, offline = false) {
			loadDatabase('scheduledTimes', function(scheduledTimes) {
				var scheduledTimeStore = db.transaction(["scheduledTime"], "readwrite")
				    .objectStore("scheduledTime");

				for(i=0; i<scheduledTimes.length; i++) {
					// deleting freeTime
					deleteFreeTime(db, scheduledTimes[i].date);
					scheduledTimeStore.add(scheduledTimes[i]);
				}
			}, offline);
		}

		loadBlockedTimeFromBackup = function(db, offline = false) {
			loadDatabase('blockedTimes', function(blockedTimes) {
				var blockedTimesStore = db.transaction(["blockedTime"], "readwrite")
				    .objectStore("blockedTime");

				for(i=0; i<blockedTimes.length; i++) {
					// deleting freeTime
					deleteFreeTime(db, blockedTimes[i].date);
					blockedTimesStore.add(blockedTimes[i]);
				}
			}, offline);
		}

		createFreeTime = function(db, n = 180) { //seis meses
			var freeTimeStore = db.transaction(["freeTime"], "readwrite")
				    .objectStore("freeTime");

			var startDate = new Date();
			//01/09/2017
			startDate.setDate(1);
			startDate.setMonth(8);
			startDate.setFullYear(2017);
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

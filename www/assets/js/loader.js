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

		dowanloadDatabase = function(data, database) {
			cordova.file.writeTextToFile({
				 text:  JSON.stringify(data[database]),
				 path: cordova.file.externalDataDirectory,
				 fileName: 'rodrigo-agenda-' + database + '.json',
				 append: false
			  },
			  {
				 success: function(file) {
					alert('Download concluido: ' + file.nativeURL);
					if(database === 'customers') {
						var fs = CordovaPromiseFS({
						  persistent: true, 
						  storageSize: 20*1024*1024, // storage size in bytes, default 800MB
						  Promise: Promise // Your favorite Promise/A+ library!
						});

						fs.deviceready.then(function(){
							alert('lendo clientes...');
							alert(fs.read('rodrigo-agenda-customers.json'));
						})
					}
				 },
				 error: function(error) {
					alert('Erro no download: ' + error)
				 }
			  }
			);

			/*fs.write('rodrigo-teste.txt', 'conteudo').then(function() {
				alert('arquivo de teste criado com sucesso');
			}, alert('erro ao escrever arquivo'));*/

			
			//fs.exists('rodrigo-agenda-customers.json'); // true - fileEntry

		}

		loadDatabase = function(database, callback) {
			$.getJSON('https://raw.githubusercontent.com/contato-alantiel/agenda/master/data/' + database + '.json?r=' + Math.random(), 
			function(data) 
			{
				callback(data[database]);
				dowanloadDatabase(data, database);
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

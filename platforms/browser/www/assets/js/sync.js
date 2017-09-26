$( document ).ready(function() {
	document.addEventListener("deviceready", function () {

	syncDownload = function(offline) {
		createFreeTime(db);

		setTimeout(function(){ 
			loadCustomerFromBackup(db, offline);
			loadScheduledTimeFromBackup(db, offline);
			loadBlockedTimeFromBackup(db, offline);
		}, 5000);

		setTimeout(function(){
			alert('Restauração realizada, para melhor desempenho, faça novo login com seu usuário comum!');
			successLoginCallback();
		}, 5000);
	}

	syncUpload = function(offline) {
		setTimeout(function(){ 
			readAndUploadDB("customer", offline);
			setTimeout(function(){ 
				readAndUploadDB("blockedTime", offline);
				setTimeout(function(){ 
					readAndUploadDB("scheduledTime", offline);
				}, 3000);
			}, 2000);
		}, 500);
	}

   $("#get-from-server").click(function (e) {
		 syncDownload(false);
	});

   $("#send-to-server").click(function (e) {
		 syncUpload(false);
	});

   $("#get-from-local").click(function (e) {
		 syncDownload(true);
	});

   $("#send-to-local").click(function (e) {
		 syncUpload(true);
	});

	
  }); //cordova ready
}); //jquery ready	

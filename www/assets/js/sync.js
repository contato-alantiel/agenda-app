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

   $("#get-from-server").click(function (e) {
		 syncDownload(false);
	});

   sendToServer = function() {
	   alert('TODO send to server');
	}

   $("#send-to-server").click(function (e) {
		 sendToServer();
	});

   $("#get-from-local").click(function (e) {
		 syncDownload(true);
	});

   sendToLocal = function() {
	   uploadBlockedTime();
	}

   $("#send-to-local").click(function (e) {
		 sendToLocal();
	});

	
  }); //cordova ready
}); //jquery ready	

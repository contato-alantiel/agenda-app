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

	syncDownload = function(offline) {
		uploadCustomer(offline);
		uploadBlockedTime(offline);
		uploadScheduledTime(offline);
	}

   $("#get-from-server").click(function (e) {
		 syncDownload(false);
	});

   $("#send-to-server").click(function (e) {
		 syncDownload(false);
	});

   $("#get-from-local").click(function (e) {
		 syncDownload(true);
	});

   $("#send-to-local").click(function (e) {
		 syncDownload(true);
	});

	
  }); //cordova ready
}); //jquery ready	

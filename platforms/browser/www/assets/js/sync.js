$( document ).ready(function() {
	document.addEventListener("deviceready", function () {

	syncDownload = function(offline) {
		createFreeTime(db);

		setTimeout(function(){ 
			loadCustomerFromBackup(db, offline);
			loadScheduledTimeFromBackup(db, offline);
			loadBlockedTimeFromBackup(db, offline);

			setTimeout(function(){
				alert('Restauração realizada, para melhor desempenho, faça novo login com seu usuário comum!');
			}, 5000);
		}, 5000);
	}

	syncUpload = function(offline) {
		readAndUploadDB("customer", offline, function() {
			setTimeout(function(){ 
				readAndUploadDB("blockedTime", offline, function() {
					setTimeout(function(){ 
						readAndUploadDB("scheduledTime", offline, function() {
							alert('Backup concluido com sucesso!');
						});
					}, 3000);
				});
			}, 2000);
		});
		
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

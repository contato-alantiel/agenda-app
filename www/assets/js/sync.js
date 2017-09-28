$( document ).ready(function() {
	document.addEventListener("deviceready", function () {

	syncDownload = function(offline, callback) {
		setTimeout(function(){ 
			loadCustomerFromBackup(db, offline);
			loadScheduledTimeFromBackup(db, offline);
			loadBlockedTimeFromBackup(db, offline);

			setTimeout(function(){
				callback();
			}, 5000);
		}, 2000);
	}

	syncUpload = function(offline, callback) {
		readAndUploadDB("customer", offline, function() {
			setTimeout(function(){ 
				readAndUploadDB("blockedTime", offline, function() {
					setTimeout(function(){ 
						readAndUploadDB("scheduledTime", offline, function() {
							callback();
						});
					}, 3000);
				});
			}, 2000);
		});
		
	}

   $("#get-from-server").click(function (e) {
       e.preventDefault();
		 e.stopPropagation();
		 var objThis = $(e.target);
		 objThis.data("old-text", objThis.val()).val("Baixando... aguarde!");
		 syncDownload(false, function() {
			objThis.val(objThis.data("old-text"));
			alert('Restauração realizada, para melhor desempenho, faça um novo login!');
			$("#logout-link").click();
		 });
	});

   $("#send-to-server").click(function (e) {
       e.preventDefault();
		 e.stopPropagation();
		 var objThis = $(e.target);
		 objThis.data("old-text", objThis.val()).val("Enviando... aguarde!");

		 syncUpload(false, function() {
			objThis.val(objThis.data("old-text"));
			alert('Backup para servidor concluido com sucesso!');
		 });
	});

   $("#get-from-local").click(function (e) {
       e.preventDefault();
		 e.stopPropagation();
		 var objThis = $(e.target);
		 objThis.data("old-text", objThis.val()).val("Baixando... aguarde!");

		 syncDownload(true, function() {
			objThis.val(objThis.data("old-text"));
			alert('Restauração realizada, para melhor desempenho, faça um novo login!');
			$("#logout-link").click();
		 });
	});

   $("#send-to-local").click(function (e) {
       e.preventDefault();
		 e.stopPropagation();
		 var objThis = $(e.target);
		 objThis.data("old-text", objThis.val()).val("Enviando... aguarde!");

		 syncUpload(true, function() {
			objThis.val(objThis.data("old-text"));
			alert('Backup local concluido com sucesso!');
		 });
	});

	
  }); //cordova ready
}); //jquery ready	

$( document ).ready(function() {
	document.addEventListener("deviceready", function () {

	$("#charge-year").val(new Date().getFullYear());
	
	$('#see-customers-to-charge').click(function (e) {
		e.stopPropagation();
		e.preventDefault();

		var d = new Date($("#charge-year").val(), $("#charge-month").val(), 1);

		var objectStore = db.transaction(["scheduledTime"], "readonly")
			          .objectStore("scheduledTime");

		lastDayOfMonth = function(date) {
		  var month = date.getMonth();
		  var year = date.getYear();

		  if( month == 1 ) { //feb
				return d.getYear() % 4 === 0 ? 29 : 28;
		  } else {
				return (month == 0 || month == 2 || month == 4 || month == 6 || month == 7 || month == 9 || month == 11) ? 31 : 30;
		  }
		}

		var year = d.getFullYear();
		var month = (d.getMonth()+1).toString().padStart(2, "0");

		var dateStart = year + "" + month + "0100"; // first hour of month
		var dateEnd = year + "" + month + "" + lastDayOfMonth(d) + "23"; // last hour of month

		$('#customers-to-charge-content').html('');
		var customers = [];

		objectStore.index('date').openCursor(IDBKeyRange.bound(dateStart, dateEnd), 'next').onsuccess = function(event) {
		 var cursor = event.target.result;
		 if (cursor) {
			if(customers.indexOf(cursor.value.customer) === -1) {
				customers.push(cursor.value.customer);

				var request = db.transaction(["customer"], "readonly")
                .objectStore("customer")
                .get(cursor.value.customer);
				request.onsuccess = function(event) {
					  var customer = request.result;
					  customerName = customer.customerName;
					  customerCost = customer.customerCost;
					  
					$('#customers-to-charge-content')
					.append('<li><a href="javascript:chargeCustomer('+customer.id+')">'+customerName+'</a></li>');
				}; //success customer
			}


			cursor.continue();
		 }
		};
	});

	chargeCustomer = function(id) {
		var request = db.transaction(["customer"], "readonly")
                .objectStore("customer")
                .get(id);
		request.onsuccess = function(event) {
		  var customer = request.result;
		  customerName = customer.customerName;
		  customerCost = customer.customerCost;
		  $('#charge-one h2 span').html(customerName);
		  $('#session-cost span').html(customerCost);

		  var objectStore = db.transaction(["scheduledTime"], "readonly")
				    .objectStore("scheduledTime");

		  var d = new Date($("#charge-year").val(), $("#charge-month").val(), 1);

		  lastDayOfMonth = function(date) {
			  var month = date.getMonth();
			  var year = date.getYear();

			  if( month == 1 ) { //feb
					return d.getYear() % 4 === 0 ? 29 : 28;
			  } else {
					return (month == 0 || month == 2 || month == 4 || month == 6 || month == 7 || month == 9 || month == 11) ? 31 : 30;
			  }
		  }

		  var year = d.getFullYear();
		  var month = (d.getMonth()+1).toString().padStart(2, "0");

		  var dateStart = year + "" + month + "0100"; // first hour of month
		  var dateEnd = year + "" + month + "" + lastDayOfMonth(d) + "23"; // last hour of month

		  $("#charge-one, #charge-all").toggleClass("hide");

		  $('#charge-customer-content').html('');
		  $('#charge-total span').html(0).data('amount', 0);

		  objectStore.index('date').openCursor(IDBKeyRange.bound(dateStart, dateEnd), 'next').onsuccess = function(event) {
			 var cursor = event.target.result;

			 if (cursor) {
				if(cursor.value.customer === id) {
					console.log(cursor.key, cursor.value);
					var date = cursor.value.date;
					var time = cursor.value.time;
					$('#charge-customer-content')
					.append('<li>' + date.substring(6,8) + '/' + date.substring(4,6) +'/'+date.substring(0,4)+ ' - ' + time + 'hrs</li>');
					var objTotal = $('#charge-total span')
					objTotal.data('amount', objTotal.data('amount') + 1 ).html(parseInt(objTotal.html()) + parseInt(customerCost));
				}
				cursor.continue();
			 }

		  }; 


		}; // customer success
	}

   shareInvoice = function() {
	   var d = new Date();
		var txtMonths = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
		var month = txtMonths[d.getMonth()];
		var nextMonthFirstDay = new Date();
		nextMonthFirstDay.setMonth(d.getMonth()+1);
		nextMonthFirstDay.setDate(1);
		var paymentDay = nextMonthFirstDay.getUTCDay() == 0 ? '06' : (nextMonthFirstDay.getUTCDay() == 1) ? '05' : '07';

		var objTotal = $('#charge-total span');

		var txtMessage = 'Bom dia!!!\n\nSegue as sessões realizadas em '+ month +' de '+ d.getFullYear() +'! Por gentileza, realizar o pagamento até o dia ' + paymentDay + ' de ' + txtMonths[nextMonthFirstDay.getMonth()] + ' e, caso transferência ou depósito, enviar o comprovante!!\n\nItaú\nAg: 4285\nCC: 1485-2\nCPF: 306.572.658-02\n\nSessões realizadas: '+objTotal.data('amount')+'\nValor total: R$ '+objTotal.html()+',00';

		window.plugins.socialsharing.shareViaWhatsApp(txtMessage , null /* img */, null /* url */, function() {console.log('sucesso')}, function(errormsg){alert('Ocorreu um erro ao tentar compartilhar mensagem' + errormsg)})
	 }

    $(".shareCustomerInvoice").click(function (e) {
		 shareInvoice();
	 });

	$("#toggle-charge-list").click(function() {
		$("#charge-one, #charge-all").toggleClass("hide");
	});

	
  }); //cordova ready
}); //jquery ready	

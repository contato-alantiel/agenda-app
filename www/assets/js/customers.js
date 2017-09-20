$( document ).ready(function() {
	document.addEventListener("deviceready", function () {
		
	 initCustomers = function (){
		loadCustomers();
	 }

    loadCustomers = function (){
		var objectStore = db.transaction("customer").objectStore("customer");
		  emptyCustomerTable();
 
        objectStore.openCursor().onsuccess = function(event) {
		    var cursor = event.target.result;
		    if (cursor) {
				addRowInHTMLTable("customer", cursor.key, cursor.value);
		        cursor.continue();
		    }
        }; 
    }


	 emptyCustomerTable = function (){
		$("#customer tbody").html("");
	 }

	 editCustomer = function(id){
		  var request = db.transaction(["customer"], "readwrite")
                .objectStore("customer")
                .get(id);
        request.onsuccess = function(event) {
			  var customer = request.result;
			  $("#customer-id").val(customer.id);
			  $("#customer-name").val(customer.customerName);
			  $("#customer-email").val(customer.customerEmail);
			  $("#customer-phone").val(customer.customerPhone);
			  $("#customer-report").val(customer.customerReport);
			  $("#customer-cost").val(customer.customerCost);

			  $(".information-images img").remove();
			  customer.customerImages.forEach(function(item) {
				 $(".information-images").prepend($('<img>',{src: item}).height(80))
			  });

			  $('#toggle-customer-view span:eq(0)').click();
        };
	 }

	 seeCustomerSchedule = function (id) {
		  var request = db.transaction(["customer"], "readonly")
                .objectStore("customer")
                .get(id);
        request.onsuccess = function(event) {
			  var customer = request.result;
			  customerName = customer.customerName;
			  customerCost = customer.customerCost;
			  $('#customer-scheduler h2 span').html(customerName);
		     $('#session-cost span').html(customerCost + ' reais');

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

			  var d = new Date();
			  var year = d.getFullYear();
			  var month = (d.getMonth()+1).toString().padStart(2, "0");

			  var dateStart = year + "" + month + "0100"; // first hour of month
			  var dateEnd = year + "" + month + "" + lastDayOfMonth(d) + "23"; // last hour of month

			  $('#toggle-customer-view').removeClass('register').addClass('scheduler').find('span:eq(0)').click();

			  $('#customer-scheduler-content').html('');
			  $('#customer-total span').html(0);

			  objectStore.index('date').openCursor(IDBKeyRange.bound(dateStart, dateEnd), 'next').onsuccess = function(event) {
				 var cursor = event.target.result;
				 if (cursor) {
					if(cursor.value.customer === id) {
						console.log(cursor.key, cursor.value);
						var date = cursor.value.date;
						var time = cursor.value.time;
						$('#customer-scheduler-content')
						.append('<li>')
						.append(date.substring(6,8) + '/' + date.substring(4,6) +'/'+date.substring(0,4)+ ' - ' + time + 'hrs')
						.append('</li>');
				   	$('#customer-total span').html(parseInt($('#customer-total span').html()) + parseInt(customerCost));
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

		var sessoes = 2;
		var total = 600;

		var txtMessage = '--Teste envio pelo aplicativo--\n\n\nBom dia!!!\n\nSegue as sessões realizadas em '+ month +' de '+ d.getFullYear() +'! Por gentileza, realizar o pagamento até o dia ' + paymentDay + ' de ' + txtMonths[nextMonthFirstDay.getMonth()] + ' e, caso transferência ou depósito, enviar o comprovante!!\n\nItaú\nAg: 4285\nCC: 1485-2\nCPF: 306.572.658-02\n\nSessões realizadas: '+sessoes+'\nValor total: R$ '+total+',00';

		window.plugins.socialsharing.shareViaWhatsApp(txtMessage , null /* img */, null /* url */, function() {console.log('sucesso')}, function(errormsg){alert('Ocorreu um erro ao tentar compartilhar mensagem' + errormsg)})
	 }

    $(".shareCustomerInvoice").click(function (e) {
		 shareInvoice();
	 });

	 addRowInHTMLTable = function (tableName, key, values){
		var actions = {
			"customer": {
   			"Editar": "editCustomer",
   			"Agenda mensal": "seeCustomerSchedule"
		}
		}
   		var table = document.getElementById(tableName).getElementsByTagName("tbody")[0];
	   	var row = document.createElement("tr");
   		var html = ["<tr>"];

		html = html.concat([renderTD(values, 'customerName')]);
		html = html.concat([renderTD(values, 'customerPhone')]);

   		html.push("<td class = 'action'>");
	   	for (var action in actions[tableName]) {
   			html = html.concat("<a href = 'javascript:", actions[tableName][action], "(", key, ")'>", action, "</a> ");
	   	}
   		html.push("</td>");
	   	html.push("</tr>");
   		row.innerHTML = html.join("");
   		table.appendChild(row);
	}

	renderTD = function (obj, key){
		var result = [];
		result.push("<td class='", key, "'>");
		if(key === 'customerPhone') {
			result.push("<a href='tel:" + obj[key] + "'>");
		}
		result.push(obj[key]);
		if(key === 'customerPhone') {
			result.push("</a>");
		}
		result.push("</td>")

		return result.join("");
	}

	updateCustomer = function (id, customerOBJ){
		customerOBJ.id = parseInt(id);
		var request = db.transaction(["customer"], "readwrite")
                .objectStore("customer")					
					 .put(customerOBJ);
                                 
        request.onsuccess = function(event) {
                alert("Paciente alterado com sucesso");
				$("form:visible")[0].reset();
				$(".information-images img").remove();
				loadCustomers();
        };
         
        request.onerror = function(event) {
                alert("Ocorreu algum erro! ");       
        }

		console.log(customerOBJ);
	}

	addToCustomer = function (customerOBJ){

		var request = db.transaction(["customer"], "readwrite")
                .objectStore("customer")
                .add(customerOBJ);
                                 
        request.onsuccess = function(event) {
                alert("Paciente adicionado com sucesso");
				$("form:visible")[0].reset();
				$(".information-images img").remove();
				loadCustomers();
        };
         
        request.onerror = function(event) {
                alert("Ocorreu algum erro! ");       
        }

		console.log(customerOBJ);
	}
   
	removeFromCustomer = function (itemId){
		var request = db.transaction(["customer"], "readwrite")
                .objectStore("customer")
                .delete(itemId);
        request.onsuccess = function(event) {
          alert("Paciente removido com sucesso!");
		  loadCustomers();
        };
	}

	captureImage = function() {
		var captureSuccess = function(mediaFiles) {
			 var i, path, len;
			 for (i = 0, len = mediaFiles.length; i < len; i += 1) {
				  path = mediaFiles[i].fullPath;
				  var random = Math.floor(Math.random()*1000);
				  var uncachedPath = path + "?r=" + random;
				  $(".information-images").prepend($('<img>',{src:uncachedPath}).height(80));
			 }
		};

		var captureError = function(error) {
			 navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
		};

		// start image capture
		navigator.device.capture.captureImage(captureSuccess, captureError, {limit:1});
	}

	$("#take-picture").click(function (e) {
		captureImage();
	});

	/*Add Customer*/
	$('#add-customer').click(function (e) {
		e.stopPropagation();
		e.preventDefault();

		var isValid = true; //TODO validate

		if (isValid) {
			var customer = {};
		   
			customer.customerName = $("#customer-name").val();
			customer.customerEmail = $("#customer-email").val();
			customer.customerPhone = $("#customer-phone").val();
			customer.customerReport = $("#customer-report").val();
			customer.customerCost = $("#customer-cost").val();

			customer.customerImages = [];
			$(".information-images img").each(function(item) {
				var objThis = $(this);
				customer.customerImages.push(objThis.attr('src'));
			});

			var id = $("#customer-id").val();
			if(id != "" && id != 0) {
				updateCustomer(id, customer);
			} else {
				addToCustomer(customer);
			}
		}
	});

	/*See customer list/form*/
	$('#toggle-customer-view').click(function (e) {
		  e.stopPropagation();
		  e.preventDefault();
		
		  var objThis = $(e.target).parents('#toggle-customer-view');
		  var objCustomerList = $("#customer-list");
		  var objCustomerScheduler = $("#customer-scheduler");
		  var objForm = objCustomerList.parent().find("form");


		  objThis.find("span").toggleClass("hide");

		  if(objThis.is('.list')) {
			  if($("form:visible").length > 0)
			  		$("form:visible")[0].reset();

			  $(".information-images img").remove();
			  objThis.removeClass('list').addClass('register');

			  objCustomerList.removeClass("hide");
			  objCustomerScheduler.addClass("hide");
			  objForm.addClass("hide");
		  } else if(objThis.is('.register')) {
			  objThis.removeClass('register').addClass('list');

			  objCustomerList.addClass("hide");
			  objCustomerScheduler.addClass("hide");
			  objForm.removeClass("hide");
		  } else if(objThis.is('.scheduler')) {
			  objThis.removeClass('scheduler').addClass('list');

			  objCustomerList.addClass("hide");
			  objCustomerScheduler.removeClass("hide");
			  objForm.addClass("hide");
		  }

	});
  }); //cordova ready
}); //jquery ready

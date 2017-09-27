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
				 $(".information-images").prepend($('<img>',{src: item, id: 'img-item-'+$(".information-images img").size()}).height(80))
			  });

			  imageDetail();

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

			  $('#customer-scheduler h2 span').html(customerName);


			  var objectStore = db.transaction(["scheduledTime"], "readonly")
			          .objectStore("scheduledTime");

			  var d = new Date();
			  var year = d.getFullYear();
			  var month = (d.getMonth()+1).toString().padStart(2, "0");
			  var day = (d.getDate()).toString().padStart(2, "0");

			  var dateStart = "2017090100"; // first historic hour
			  var dateEnd = year + "" + month + "" + day + "23"; // last hour of month

			  $('#toggle-customer-view').removeClass('register').addClass('scheduler').find('span:eq(0)').click();

			  $('#customer-scheduler-content').html('');

			  objectStore.index('date').openCursor(IDBKeyRange.bound(dateStart, dateEnd), 'next').onsuccess = function(event) {
				 var cursor = event.target.result;
				 if (cursor) {
					if(cursor.value.customer === id) {
						var date = cursor.value.date;
						var time = cursor.value.time;
						$('#customer-scheduler-content')
						.append('<li>')
						.append(date.substring(6,8) + '/' + date.substring(4,6) +'/'+date.substring(0,4)+ ' - ' + time + 'hrs')
						.append('</li>');
					}
	

					cursor.continue();
				 }
			  }; 


        }; // customer success
	 }

	 addRowInHTMLTable = function (tableName, key, values){
		var actions = {
			"customer": {
   			"Editar": "editCustomer",
   			"Histórico": "seeCustomerSchedule"
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

	imageDetail = function() {
		$(".information-images img").unbind('click').click(function(e) {
			var objThis = $(e.target);

			$("#dialog-detail-img img").attr('src', objThis.attr('src'));

			$("#dialog-detail-img").dialog({
				resizable: true,
				height: "auto",
				width: "auto",
				modal: true,
				buttons: {
					"Remover": function() {
					  $("#" + objThis.attr('id')).remove();
					  $( this ).dialog( "close" );
					},
					"Fechar": function() {
					  $( this ).dialog( "close" );
					}
				}
			});
		});
	}

	captureImage = function() {
		var captureSuccess = function(mediaFiles) {
			 var i, path, len;
			 for (i = 0, len = mediaFiles.length; i < len; i += 1) {
				  path = mediaFiles[i].fullPath;
				  var random = Math.floor(Math.random()*1000);
				  var uncachedPath = path + "?r=" + random;
				  $(".information-images").prepend($('<img>',{src: uncachedPath, id: 'img-item-'+$(".information-images img").size()}).height(80))

				  imageDetail();
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

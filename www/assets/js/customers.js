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

			  $('#see-customer-list').click();
        };
	 }

	 addRowInHTMLTable = function (tableName, key, values){
		var actions = {
			"customer": {
   			"Editar": "editCustomer",
   			"Ver agenda": "seeCustomerSchedule"
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

			var id = $("#customer-id").val();
			if(id != "" && id != 0) {
				updateCustomer(id, customer);
			} else {
				addToCustomer(customer);
			}
		}
	});

	/*See customer list/form*/
	$('#see-customer-list').click(function (e) {
		  e.stopPropagation();
		  e.preventDefault();
		
		  var objThis = $(e.target);
		  var objCustomerList = $("#customer-list");
		  objCustomerList.parent().find("form").toggleClass("hide");
		  objCustomerList.toggleClass("hide");
		  objThis.parent().find("span").toggleClass("hide");
	});
  }); //cordova ready
}); //jquery ready

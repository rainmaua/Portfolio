
var isLoggedIn = false;
var currentUsername = "";
var clickedDate = "";
var event_id = ""; 
// For our purposes, we can keep the current month in a variable in the global scope
var today = new Date();
var currentMonth = new Month(today.getFullYear(), today.getMonth()); // October 2023 !!! 9 means October. 

let monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
// Modeal reference: https://www.youtube.com/watch?v=TAB_v6yBXIE
let display_event_modal = document.querySelector("#modal_1"); 
let openModal = document.querySelector(".open-btn");
let closeModal = document.querySelector(".close-btn"); 
let deleteEventModal = document.querySelector(".delete-btn"); 
let updateEventModal = document.querySelector(".update-btn"); 
const select = document.querySelector("#category");
const shareCheckbox = document.querySelector("#share_event_btn");
const shareContainer= document.querySelector("#share_container");
var refresh_token; 
shareContainer.style.visibility = 'hidden'; 
// increasing font size button:
function changeFontSizeBySlider(){
	var slider = document.getElementById("slider"); 
	document.getElementById("calendar_table").style.fontSize = slider.value; 
}
// create a new token everytime user refreshes the page so that token can be used after refreshing the page. 
window.onload = function() { 
    $.post("token.php", {}, function (data) {
		//console.log("refresh data loaded: " + data);
		let jsonData = JSON.parse(data);
		refresh_token = jsonData.token;
	});
};
closeModal.addEventListener("click", ()=> {
	display_event_modal.close(); 
}); 

shareCheckbox.addEventListener('change', ()=> {

	console.log("share event is clicked"); 
	if (shareCheckbox.checked){
		shareContainer.style.visibility = 'visible'; 

	}
	else{
		shareContainer.style.visibility = 'hidden'; 

	}
});

var counter = 1;
$('#add_user_btn').on('click', function(){
	let element = document.createElement("input"); 
	element.setAttribute("class", "shared_user"); 
	element.setAttribute("type", "text"); 
	element.setAttribute("id", "shared_user_"+counter);
	element.setAttribute("placeholder", "username to share event");
	// <input id="shared_user_#" class="shared_user" type="text" placeholder="..."/>
	
	$('#share_container').append(element);
	counter++;
}); 
$('#delete_user_btn').on('click', function(){
	let elements = document.getElementsByClassName("shared_user"); 
	let index = elements.length-1; 
	if (elements[index]){
		elements[index].parentNode.removeChild(elements[index]); 
		counter--;
	}
	else{
		return;
	}
}); 

// document.getElementById("add_user_btn").addEventListener('click', ()=> {
// 	shareContainer.appendChild(document.getElementById("shared_user")); 
// })




// Change the month when the "next" button is pressed
document.getElementById("next_month_btn").addEventListener("click", function (event) {
	currentMonth = currentMonth.nextMonth(); // Previous month would be currentMonth.prevMonth()
	updateCalendar(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
	console.log("The new month is " + monthArray[currentMonth.month] + " " + currentMonth.year);
}, false);

document.getElementById("prev_month_btn").addEventListener("click", function (event) {
	currentMonth = currentMonth.prevMonth(); // Previous month would be currentMonth.prevMonth()
	updateCalendar(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
	console.log("The previous month is " + monthArray[currentMonth.month] + " " + currentMonth.year);
}, false);


const clickedTd = function (e) {
	e = window.event || e;
	if (this === e.target) {
		// put your code here
		console.log("clicked td");
	}
	// when you click a td to create a new element, reset values previously entered in the cell. 
	document.getElementById("submit_form").reset();

	clickedDate = $(this).attr('id');


	// make the hidden form elements visible
	// document.getElementById('event_title').style.visibility='visible';   
	// document.getElementById('submit_event_btn').style.visibility='visible';
	// to update date to match that of clicked cell. 
	document.getElementById("date").value = clickedDate; 
	// to distinguish from update_event
	document.getElementById("submit_event_id").value = null;
	if (currentUsername != "") {
		$("#submit_form").dialog({

			title: "New Event",
			width: 300,
			height: 300,
			modal: true,
			buttons: [
				{
					text: 'Close',
					click: function () {
						$(this).dialog('close');
					}
				}
			],

		});
	}
	else {
		alert("Please register to add events");
	}

}

// $(document).on('click', '.closeBtn', myFunc);


const clickedEventDiv = function (e) {
	// prevent clicking this div would also click its parent element td when eventDiv event acutally exists. 
	console.log("e: ", e.target.id);
	if (e.target.tagName == "LI") {
		console.log("clicked event div");
		// display event 
		$.post("event_read.php", {event_id: e.target.id}, function (data) {
			console.log("Data read clicked loaded: ", data);
			let jsonData = JSON.parse(data);

			if (jsonData.success == true) {
				//console.log("id: ", jsonData.events_array); 
				let jsonArray = JSON.parse(jsonData.events_array); 

				for (let i = 0; i<jsonArray.length; ++i) {
					let event_id = jsonArray[i].event_id; 
					let event_title = jsonArray[i].event_title; 
					let event_date = jsonArray[i].event_date; 
					let start_at = jsonArray[i].start_at; 
					let end_at = jsonArray[i].end_at; 
					let category = jsonArray[i].category; 
					let shared_username = jsonArray[i].shared_username;

					document.getElementById("display_title").innerHTML = event_title; 
					document.getElementById("display_date").innerHTML = event_date; 
					document.getElementById("display_start_at").innerHTML = start_at; 
					document.getElementById("display_end_at").innerHTML = end_at; 
					document.getElementById("display_event_id").innerHTML = event_id; 
					document.getElementById("display_category_hidden").innerHTML = category; 
					document.getElementById("display_shared_username").innerHTML = shared_username; 
					// to display To Do instead of its value 'to_do'.
					document.getElementById("display_category").innerHTML = document.getElementById(category).textContent; 
					// document.getElementById("display_event_id").hide(); 
					console.log("display_category: ", document.getElementById("display_category").innerHTML); 
					document.getElementById("display_event_id").style.visibility='hidden';   	
					document.getElementById("display_category_hidden").style.visibility='hidden'; 
				}
			}
			else {
				console.log("Data event was not loaded."); 
			}
	
			
		});
		
		// delete event
		deleteEventModal.addEventListener("click", ()=> {
			// send event_id to delete php. 
			console.log("delete btn clicked");
			// console.log(document.getElementById("display_event_id").innerHTML); 
			if (document.getElementById("display_event_id").innerHTML == ""){
				console.log("event_id is null");
				return; 
			}
			
			// let event_token = $('#token').val(); 
			// console.log("event_token for delete: ", event_token); 
			let token_for_delete  = refresh_token; 
			if (login_token){
				token_for_delete = login_token; 
			};
			const data = { 'event_id': document.getElementById("display_event_id").innerHTML, 'token': token_for_delete};


			fetch("event_delete.php", {
				method: 'POST',
				body: JSON.stringify(data),
				headers: {'content-type': 'application/json' }
			})
				// .then(response => response.json())
				.then(response=>{
					if (!response.ok) {
						return {failed: true, status: response.status};
					}
					return response.json();
				})
				.then(function (data) {
					// let jsondata = JSON.parse(data); 
					// to convert [object Object ] to json format, use JSON.stringify()
					console.log("Data delete loaded: " + JSON.stringify(data));
					let jsonData = JSON.parse(JSON.stringify(data)); 

					if (jsonData.success) {
						console.log("Delete form successfully submitted");
						// e.target.remove(); 
						updateCalendar();
						display_event_modal.close(); 
					}
					else {
						console.log(`Delete form was not submitted:  ${data.message}`);
					}
				})
				.catch(err => console.error(err));
		}); 	
		// edit event
		updateEventModal.addEventListener("click", ()=> {
			console.log("update button is clicked"); 
			display_event_modal.close(); 
			console.log("event_title: ", document.getElementById("display_title").innerHTML);
			document.getElementById("event_title").value = document.getElementById("display_title").innerHTML; 
			document.getElementById("date").value = document.getElementById("display_date").innerHTML; 
			document.getElementById("start_at").value = document.getElementById("display_start_at").innerHTML.slice(0,-3); // format time: 00:00:00 -> 00:00; 
			document.getElementById("end_at").value = document.getElementById("display_end_at").innerHTML.slice(0,-3); // format time: 00:00:00 -> 00:00; 
			document.getElementById("shared_user_0").value = document.getElementById("display_shared_username").innerHTML; 
			if (document.getElementById("display_shared_username").innerHTML == ""){
				console.log("shared username is empty!"); 
			}
			else {
				console.log("shared username is not empty");
				shareCheckbox.checked
				shareContainer.style.visibility = 'visible'; 
				
				
			}
			console.log("edit category: ", document.getElementById("display_category_hidden").innerHTML); 
			
			select.value = document.getElementById("display_category_hidden").innerHTML; 
			// add event info in the #submit_form
			document.getElementById("submit_event_id").value = document.getElementById("display_event_id").innerHTML; 

			$("#submit_form").dialog({

				title: "Event",
				width: 300,
				height: 300,
				modal: true,
				buttons: [
					{
						text: 'Close',
						click: function () {
							$(this).dialog('close');
						}
					}
				],
	
			});
			
		});

		
		display_event_modal.showModal();
		
		e.stopPropagation();
	}
	else {

	}


}


/*Reference: https://www.w3schools.com/js/js_cookies.asp */
function getCookie(cname) {
	let name = cname + "=";
	let ca = document.cookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

// This updateCalendar() function only alerts the dates in the currently specified month.  You need to write
// it to modify the DOM (optionally using jQuery) to display the days and weeks in the current month.
function updateCalendar() {
	// to check whether user is logged in even after refreshing a page
	if (getCookie("isLoggedIn") != "") {
		console.log("cookieVal: ", getCookie("isLoggedIn"));
		// to convert cookieVal to boolean
		isLoggedIn = (getCookie("isLoggedIn") === 'true');
		currentUsername = getCookie("username");

	}
	else {
		console.log("cookieVal: ", false);
		isLoggedIn = false;
	}

	if (isLoggedIn) {
		console.log("user is logged in");
		console.log("updateCalendar username: ", currentUsername);
		document.getElementById("nav_title").innerHTML = currentUsername+"&apos; calendar"; 
		$('#signup_form').hide();
		$('#login_form').hide();
		$('#logout_btn').show();
		$('#nav_title').show(); 

	}
	else {
		console.log("user is not logged in");
		$('#signup_form').show();
		$('#login_form').show();
		$('#logout_btn').hide();
		$('#submit_form').hide(); 
		$('#nav_title').hide(); 
	}
	var weeks = currentMonth.getWeeks();
	let calendar_table = document.getElementById("calendar_table");
	let tbody = document.getElementsByTagName('tbody');
	// if tbody already exists, remove it
	if (typeof (tbody[0]) != 'undefined' && tbody[0] != null) {
		calendar_table.removeChild(tbody[0]);
	}
	let newTbody = document.createElement('tbody');
	calendar_table.appendChild(newTbody);

	for (var w in weeks) {
		var days = weeks[w].getDates();
		// days contains normal JavaScript Date objects.

		// alert("Week starting on "+days[0]);
		let dayCount = 0;
		for (var d in days) {
			// You can see console.log() output in your JavaScript debugging tool, like Firebug,
			// WebWit Inspector, or Dragonfly.
			if (dayCount == 0) {
				var newRow = document.createElement("tr");
				newRow.setAttribute('class', 'week_row');
				newRow.setAttribute('id', 'week_' + w);
				newTbody.appendChild(newRow);
			}
			else if (dayCount == 6) {
				dayCount = 0;
			}
			let newCell = document.createElement('td');
			// to make all cells in calendar clikable.
			newCell.addEventListener("click", clickedTd, false);

			if (days[d].getMonth() == currentMonth.month) {
				newCell.setAttribute('class', 'cell');
			}
			else {
				newCell.setAttribute('class', 'shadow_cell');
			}

			newCell.setAttribute('id', days[d].toISOString().split('T')[0]);
			let newDateDiv = document.createElement('div');
			newDateDiv.setAttribute('class', 'date-div');
			newDateDiv.textContent = days[d].getDate();
			newCell.appendChild(newDateDiv);


			// create new div to store events 
			let newEventDiv = document.createElement("div");
			// to make all events in calendar clickable.


			newEventDiv.addEventListener("click", clickedEventDiv, false);
			newEventDiv.setAttribute("class", "event-div");
			// $(document).on('click', newEventDiv, clickedEventDiv);
			newEventDiv.setAttribute("id", days[d].toISOString().split('T')[0] + "_div");
			
			let newUL = document.createElement("ul");
			newEventDiv.appendChild(newUL); 
			newCell.appendChild(newEventDiv);

			newRow.appendChild(newCell);

			// load data from mysql database to javascript. 
			// order matters! please don't put this code above newCell.appendChild(newEventDiv); 
			// show events if user is logged in.
			if (currentUsername == "") {
				//console.log("Please log in to view events"); 
			}
			else {
				// $("#" + newEventDiv.id).load("./event_read.php", {
				// 	date: newCell.id
				// });
				
				
				$.post("event_read.php", {date: newCell.id}, function (data) {
					//console.log("Data read loaded: ", data);
					let jsonData = JSON.parse(data);
					if (jsonData.success == true) {
						// console.log("id: ", jsonData.events_array); 
						// console.log("length: ", JSON.parse(jsonData.events_array).length);
						let jsonArray = JSON.parse(jsonData.events_array); 
						for (let i = 0; i<jsonArray.length; ++i) {
							let event_title = jsonArray[i].event_title; 
							let event_id = jsonArray[i].event_id; 
							let category = jsonArray[i].category; 
							// add event id to tag and than store event title in it
							newEventDiv.firstChild.innerHTML +="<li id="+event_id+" class="+category+">"+event_title+"</li>";
						}
					}
					else {
						console.log("Data event was not loaded."); 
					}
			
					
				});
				

				

			}


			dayCount++;
		}

	}
	// to display current month
	document.getElementById("current_date_display").textContent = monthArray[currentMonth.month] + " " + currentMonth.year;
	// to update today cell if it's current month 
	if (parseInt(currentMonth.month) == today.getMonth()) {
		if (document.getElementById(today.toISOString().split('T')[0])){
			let todayCell = document.getElementById(today.toISOString().split('T')[0]);
			todayCell.setAttribute('class', 'today_cell');
		}
		
	}
}

updateCalendar();

// Total number of talks yet to be conducted
var number_of_talks = 0;

// Enumerator for the current status of the meeting
var meeting_states = {
	IN_PROGRESS : 0,
	NO_MEETING : 1
}

// The status of the meeting
var meeting_status = meeting_states.NO_MEETING;

// Starting time of the current talk in unix format
var start_time;

// The maximum time available for the current talk
var time_for_talk;

// Timer Function to keep track of the time for the talk
var t;

/*
Function: addTalk
This function will be called when a new talk has to be added.
There is no limit on the number of talks.
The function validates the input, i.e,. title of the talk and the time for the talk
in seconds.
Once the validation is success, a new row is created in the table for the
list of talks yet to be conducted and the details of the new talk is added into
a row into the table.
*/
function addTalk() {
	var title = document.getElementById("talk_title").value;
	var time = document.getElementById("talk_time").value;
	
	if (title == null || title == "") {
		document.getElementById("invalid_title").style.visibility = "visible";
		return;
	}
	if (time == null || time == "" || isNaN(time)) {
		document.getElementById("invalid_title").style.visibility = "hidden";
		document.getElementById("invalid_time").style.visibility = "visible";
		return;
	}
	document.getElementById("invalid_title").style.visibility = "hidden";
	document.getElementById("invalid_time").style.visibility = "hidden";
	var table = document.getElementById("list_of_talks");
	var row = document.createElement("tr");
	row.className = "talk_table";
	table.appendChild(row);
	var cell1 = row.insertCell(0);
	cell1.className = "talk_table";
	var cell2 = row.insertCell(1);
	cell2.className = "talk_table";
	var cell3 = row.insertCell(2);
	cell3.className = "talk_table";
	cell1.innerHTML = title;
	cell2.innerHTML = time;
	var bt = document.createElement("button");
	bt.innerHTML = "Start Talk";
	bt.value = ++number_of_talks;
	bt.onclick = function() {startTalk( this.value) };
	cell3.appendChild(bt);
}

/*
Function: addTalkInProgress
This function is responsible for starting a talk when the user selects to start a talk.
It obtains the time limit for the talk and the title of the talk and displays them
accordingly.
*/
function addTalkInProgress ( row ) {
	var table = document.getElementById("list_of_talks");
	
	document.getElementById("talk_in_progress").style.visibility = "visible";
	
	document.getElementById("talk_name").innerHTML = table.rows[row].cells[0].innerHTML;
	
	document.getElementById("time_left").rows[0].cells[0].innerHTML = table.rows[row].cells[1].innerHTML;
}

/*
Function: update_time
This function keeps track of the progress, i.e,. the time remaining for the current talk.
Once the time remaining is less than 30% and more than 15% of the total allocated time,
it displays the box in green.
When the time remaining is less than 15% and more 0, it displays the box in yellow.
When the time is used up for the talk, the box turns red.
*/
function update_time() {
	var current_time = new Date().getTime();
	if ((current_time - start_time)/1000 >= time_for_talk) {
		document.getElementById("talk_in_progress").style.background = "red";
		document.getElementById("time_left").rows[0].cells[0].innerHTML = '0';
		t=setTimeout(function(){finishTalk()},3000);
		return;
	}
	document.getElementById("time_left").rows[0].cells[0].innerHTML =
		Math.floor(time_for_talk - (current_time - start_time)/1000);
	if (((current_time - start_time)/1000) >= (0.85 * time_for_talk)) {
		document.getElementById("talk_in_progress").style.background = "yellow";
	} else if ((current_time - start_time)/1000 >= 0.7 * time_for_talk) {
		document.getElementById("talk_in_progress").style.background = "green";
	}
	t=setTimeout(function(){update_time()},499);
}

/*
Function: startTalk
Input: the row index into the table in which the talk that has to be
	started is present.
This function checks if there is a talk in progress already at which case, it throws an alert.
If there is no talk in progress, it starts a talk and deletes it from the table of talks
yet to be conducted.
This talk is added to the box of current talk in progress along with its timer.
*/
function startTalk( row ) {
	if (meeting_status == meeting_states.IN_PROGRESS) {
		alert ("Talk in progress. Please wait or end the current talk.");
		return;
	}
	
	start_time = new Date().getTime();
	
	meeting_status = meeting_states.IN_PROGRESS;
	var table = document.getElementById("list_of_talks");
	for (var i = row; i <= number_of_talks; i++) {
		table.rows[i].cells[2].children[0].value = i-1;
	}
	--number_of_talks;
	
	time_for_talk = table.rows[row].cells[1].innerHTML;
	
	addTalkInProgress ( row );
	
	table.deleteRow(row);
	
	t=setTimeout(function(){update_time()},500);
}

/*
Function: finishTalk
This function updates the fields as required once a talk has completed.
This can be called by either manually ending a talk or 3 seconds after the timer runs out.
It clears the current talk box and adds the talk to the list of completed talks.
*/
function finishTalk() {
	clearTimeout(t);
	meeting_status = meeting_states.NO_MEETING;
	document.getElementById("talk_in_progress").style.visibility = "hidden";
	document.getElementById("talk_in_progress").style.background = "white";
	
	var table = document.getElementById("list_of_completed_talks");
	var row = document.createElement("tr");
	row.className = "talk_table";
	table.appendChild(row);
	var cell1 = row.insertCell(0);
	cell1.className = "talk_table";
	cell1.innerHTML = document.getElementById("talk_name").innerHTML;
}

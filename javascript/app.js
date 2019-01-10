$(document).ready(function() {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCQd5YQIOAoC04DFLL8d48NoyG6vdZfkAU",
    authDomain: "train-schedule-ba1e0.firebaseapp.com",
    databaseURL: "https://train-schedule-ba1e0.firebaseio.com",
    projectId: "train-schedule-ba1e0",
    storageBucket: "train-schedule-ba1e0.appspot.com",
    messagingSenderId: "943724164902"
  };
  firebase.initializeApp(config);


  // save firebase database reference
  var database = firebase.database();
  

  // add event listener for form submit
  $("#submit-btn").on("click", function(event) {
    event.preventDefault();

    var employeeData = {
      name: $("#name-input").val().trim(),
      role: $("#role-input").val().trim(),
      startDate: $("#start-input").val(),
      rate: parseInt($("#rate-input").val())
    };

    // convert employee start date to unix to store unix time in DB
    employeeData.startDate = moment(employeeData.startDate, "YYYY-MM-DD").format("X");

    // add employee to firebase using .push() method instead of .set()
    database.ref().push(employeeData);

    // clear out any value in form input tags on page
    $("#name-input").val("");
    $("#role-input").val("");
    $("#start-input").val("");
    $("#rate-input").val("");

  });

  // set up child_added event listener for firebase to send new information every time an employee is added and when the page loads
  database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
    var name = childSnapshot.val().name;
    var role = childSnapshot.val().role;
    var rate = childSnapshot.val().rate;
    var startDate = childSnapshot.val().startDate;

    // if you need the key of the child
    console.log(childSnapshot.key);
   
    // convert startDate to pretty print on page (ex. 02/20/1999)
    var startDateFormatted = moment(startDate, "X").format("MM/DD/YYYY");

    // determine amount of months between startDate and now
    var totalMonthsWorked = moment().diff(moment(startDate, "X"), "months");

    // multiply number of months worked (calculated above) and monthly rate to get total billed
    var totalBilled = totalMonthsWorked * rate;

    // create a table row for my employee
    var $tr = $("<tr>");
    $tr
      .attr("employee-key", childSnapshot.key)
      .append(`<td>${name}</td>`)
      .append(`<td>${role}</td>`)
      .append(`<td>${startDateFormatted}</td>`)
      .append(`<td>${totalMonthsWorked}</td>`)
      .append(`<td>${rate}</td>`)
      .append(`<td>$${totalBilled}</td>`);

    // select table's body and append employee table row
    $("tbody#employee-info").append($tr);


  });


});
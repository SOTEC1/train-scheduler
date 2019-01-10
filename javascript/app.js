$(document).ready(function () {

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
  $("#submit-btn").on("click", function (event) {
    event.preventDefault();

    var employeeData = {
      name: $("#name-input").val().trim(),
      destination: $("#destination-input").val().trim(),
      startTime: parseInt($("#start-input").val()),
      frequency: parseInt($("#frequency-input").val())
    };

    // add employee to firebase using .push() method instead of .set()
    database.ref().push(employeeData);

    // clear out any value in form input tags on page
    $("#name-input").val("");
    $("#destination-input").val("");
    $("#start-input").val("");
    $("#frequency-input").val("");

  });

  // set up child_added event listener for firebase to send new information every time an employee is added and when the page loads
  database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());
    var name = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var frequency = childSnapshot.val().frequency;
    var startTime = childSnapshot.val().startTime;

    // if you need the key of the child
    console.log(childSnapshot.key);

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(startTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted.format("HH:mm"));

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm");
    console.log("ARRIVAL TIME: " + nextTrain);


    // create a table row for my employee
    var $tr = $("<tr>");
    $tr
      .attr("employee-key", childSnapshot.key)
      .append(`<td>${name}</td>`)
      .append(`<td>${destination}</td>`)
      .append(`<td>${startTime}</td>`)
      .append(`<td>${frequency}</td>`)
      .append(`<td>${tMinutesTillTrain}</td>`)
      .append(`<td>${nextTrain}</td>`);

    // select table's body and append employee table row
    $("tbody#employee-info").append($tr);


  });


});
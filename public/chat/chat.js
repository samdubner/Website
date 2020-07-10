//needed for socket.io
var socket = io.connect();

//sends message when user connects
socket.on("socket", function(data) {
  socket.emit("UC", "user connected");
});

//calls create message function, when a message is received
socket.on("message", function(data) {
  createMessageReceieved(data.mt, data.ms, data.rm);
});

socket.on("addRoomToList", function(data) {
  addRoomToList(data.crn);
});

socket.on("getRoomList", function(data) {
  getRoomList();
});

socket.on("setName", function(data) {
  setName(data.isValid, data.name);
});

//sets having a username to be automatically false
var hasSetUsername = false;

var currentRoom = "home";

var joinedRoom = false;

$(window).focus(function() {
  window.isFocused = true;
});
$(window).blur(function() {
  window.isFocused = false;
});

function urlify(text) {
  var urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, function(url) {
    return '<a href="' + url + '">' + url + "</a>";
  });
}

//sends actual text of the message to the server
function sendMessage() {
  //makes sure the username is set
  if (!hasSetUsername) {
    alert("Please set a username");
    return;
  }

  if (!joinedRoom) {
    alert("Please join a chat room");
    return;
  }

  var textbubble = $(document.createElement("p"));
  var div = $(document.createElement("div"));
  div.addClass("right-align");
  var username = $("#username").html();
  text = $("#textbox-text").val();
  text = text.replace(/\</g, "&lt;");
  text = urlify(text);
  //sends message and username to the server
  socket.emit("message", {
    text: text,
    username: username,
    room: currentRoom
  });
}

//shows your own message on screen
function createMessageSelf(text) {
  if (text == "" || !joinedRoom) {
    return;
  } else {
    var textbubble = $(document.createElement("p"));
    var div = $(document.createElement("div"));
    div.addClass("right-align");
    var username = $("#username").html();
    textbubble.html(username + ": " + "<br>" + urlify(text));
    textbubble.addClass("bubble-right");
    div.append(textbubble);
    $(".text-display").append(div);
    $("#content a[href^='http://']").attr("target", "_blank");
    //scrolls to the bottom of the .text-display
    $(".text-display").scrollTop($(".text-display")[0].scrollHeight);
    $("#textbox-text").val("");
  }
}

//creates others peoples messages
function createMessageReceieved(text, username, room) {
  if (text == "") {
  } else if (room != currentRoom) {
    return;
  } else {
    var textbubble = $(document.createElement("p"));
    var div = $(document.createElement("div"));
    div.addClass("left-align");
    textbubble.html(username + ": " + "<br>" + text);
    textbubble.addClass("bubble-left");
    div.append(textbubble);
    $(".text-display").append(div);
    $("#content a[href^='http://']").attr("target", "_blank");
    $(".text-display").scrollTop($(".text-display")[0].scrollHeight);
    if (window.isFocused == false) {
      var audio = new Audio("/audio/message.mp3");
      audio.play();
    }
  }
}

//function for setting someones name.
function attemptName() {
  var name = $("#textbox-name").val();
  if (name.length > 30) {
    alert("Username must be less than or equal to 20 characters.");
    return;
  }
  $("#textbox-name").val("");
  socket.emit("attemptName", name);
}

function setName(isValid, name) {
  if (isValid) {
    var setName = $(document.createElement("h3"));
    setName.attr("id", "username");
    setName.addClass("username-text enter-username");
    name = name.replace(/\</g, "&lt;");
    setName.html(name);
    $(".enter-username").remove();
    $(".username-div").append(setName);
    hasSetUsername = true;
    $("#chatRoomButton").prop("disabled", false);
  } else {
    alert(`The name ${name} is already taken, please try again`);
  }
}

//variable for checking if the Chat Room overlay is open
var isChatRoomOpen = false;

//creates all the elements in order to display the overlay/menu
function chatRoomMenuOpen() {
  $("#overlay").show();
  $("#overlayMenu").show();
  isChatRoomOpen = true;
}

//closes overlay
//WHY CAN'T EVERYTHING BE THIS EASY
function chatRoomMenuClose() {
  $(".overlay").hide();
  isChatRoomOpen = false;
}

//function that sends a attempt to create a chat room to the server
function createChatRoom(privacySetting) {
  var times = 0;

  //makes sure that the username is already set
  if (!hasSetUsername) {
    alert("Please set a username");
    return;
  }

  //sets values for the username/chatroom
  var username = $("#username").html();
  var chatRoomName = $("#roomCreateText").val();

  if (chatRoomName.length > 18) {
    alert(
      "The name of the chatroom must be shorter than or equal to 18 characters."
    );
    return;
  }

  //sends server the values for the username/chatroom
  socket.emit("roomAttempt", {
    user: username,
    crn: chatRoomName,
    privacy: privacySetting
  });

  //displays "room already exists" if the room already exists...
  socket.on("roomFailure", function(data) {
    alert(data.message);
    return;
  });

  //shows that the room was created if the room was created...
  socket.on("roomSuccess", function(data) {
    while (times < 1) {
      console.log("test");
      socket.emit("joinRoomAttempt", {
        user: username,
        crn: chatRoomName
      });
      var textbubble = $(document.createElement("p"));
      var div = $(document.createElement("div"));
      div.addClass("left-align");
      textbubble.html(
        "Announcer" + ": " + "<br>" + "You have joined room: " + chatRoomName
      );
      textbubble.addClass("bubble-left");
      div.append(textbubble);
      $(".text-display").append(div);
      $("#content a[href^='http://']").attr("target", "_blank");
      $(".text-display").scrollTop($(".text-display")[0].scrollHeight);
      $("#roomCreateText").val("");
      joinedRoom = true;
      showInput();
      times++;
    }
  });

  //closes overlay so it cannot be spammed as easily
  chatRoomMenuClose();
}

function joinChatRoom() {
  var times = 0;
  // var time = 0;

  if (!hasSetUsername) {
    alert("Please set a username");
    return;
  }

  //sets values for the username/chatroom
  var username = $("#username").html();
  var chatRoomName = $("#roomJoinText").val();

  socket.emit("joinRoomAttempt", {
    user: username,
    crn: chatRoomName
  });

  socket.on("joinFailure", function(data) {
    alert(data.message);
    chatRoomMenuClose();
    return;
  });

  socket.on("joinSuccess", function(data) {
    while (times < 1) {
      currentRoom = data.jr;
      joinedRoom = true;
      chatRoomMenuClose();
      showInput();
      return;
    }
  });
}

var id = 0;

function addRoomToList(crn) {
  var mainDiv = $(document.createElement("div"));
  mainDiv.addClass("listedRoom");

  var h3 = $(document.createElement("h3"));
  h3.prop("id", "name");
  h3.prop("whichNumber", id);
  h3.html(crn);

  var joinButton = $(document.createElement("input"));
  joinButton.prop("type", "button");
  joinButton.prop("value", "Join Room");
  joinButton.prop("whichNumber", id);
  joinButton.addClass("joinButton");
  joinButton.prop("id", "button" + id);

  mainDiv.append(h3);
  mainDiv.append(joinButton);
  $(".roomListDisplay").append(mainDiv);

  id++;
}

function getRoomList() {
  socket.emit("getRooms", {
    text: "stuff"
  });
}

$(document).on("keydown", "#voiceJoinText", function(e) {
  var text = $("#voiceJoinText").val();
  if (text == "" || text.split("")[0] == " ") {
    return;
  }

  if (e.which == 13) {
    e.preventDefault();
    $("#roomJoinButton").trigger("click");
  }
});

//lets you click enter to send your message
$("#textbox-text").on("keydown", function(e) {
  var text = $("#textbox-text").val();
  if (text == "" || text.split("")[0] == " ") {
    return;
  }
  if (e.which == 13) {
    e.preventDefault();
    $("#submit-button").trigger("click");
  }
});

//lets you click enter to set your name
$("#textbox-name").on("keydown", function(e) {
  var text = $("#textbox-name").val();
  if (text == "" || text.split("")[0] == " ") {
    return;
  }
  if (e.which == 13) {
    e.preventDefault();
    $("#submit-name").trigger("click");
  }
});

//lets you click enter to run createChatRoom();
$(document).on("keydown", "#roomCreateText", function(e) {
  var text = $("#roomCreateText").val();
  if (text == "" || text.split("")[0] == " ") {
    return;
  }
  if (e.which == 13) {
    e.preventDefault();
    $("#roomCreateButton").trigger("click");
  }
});

//lets you click enter to run joinChatRoom();
$(document).on("keydown", "#roomJoinText", function(e) {
  var text = $("#roomJoinText").val();
  if (text == "" || text.split("")[0] == " ") {
    return;
  }
  if (e.which == 13) {
    e.preventDefault();
    $("#roomJoinButton").trigger("click");
  }
});

//stops you from sending message if the textbox is blank
$(document).on("change keyup paste mouseup", "#textbox-text", function() {
  var text = $("#textbox-text").val();
  if (text == "" || text.split("")[0] == " ") {
    $("#submit-button").attr("disabled", true);
  } else {
    $("#submit-button").attr("disabled", false);
  }
});

//stops you from setting your name if the name box is blank
$(document).on("change keyup paste mouseup", "#textbox-name", function() {
  var text = $("#textbox-name").val();
  if (text == "" || text.split("")[0] == " ") {
    $("#submit-name").attr("disabled", true);
  } else {
    $("#submit-name").attr("disabled", false);
  }
});

//stops you from creating a chat room if the name box is blank
$(document).on("change keyup paste mouseup", "#roomCreateText", function() {
  var text = $("#roomCreateText").val();
  if (text == "" || text.split("")[0] == " ") {
    $("#roomCreateButton").attr("disabled", true);
  } else {
    $("#roomCreateButton").attr("disabled", false);
  }
});

//stops you from joining a chat room if the name box is blank
$(document).on("change keyup paste mouseup", "#roomJoinText", function() {
  var text = $("#roomJoinText").val();
  if (text == "" || text.split("")[0] == " ") {
    $("#roomJoinButton").attr("disabled", true);
  } else {
    $("#roomJoinButton").attr("disabled", false);
  }
});

//when you click submit to send your message this runs 2 functions
$("#submit-button").on("click", function() {
  var text = $("#textbox-text").val();
  //this function sends your message to the server
  sendMessage();
  //this function shows your own message on the right hand side
  createMessageSelf(text);
});

//This calls the function that sets your name
$("#submit-name").on("click", function() {
  attemptName();
});

//This calls the function that opens the overlay
$("#chatRoomButton").on("click", function() {
  chatRoomMenuOpen();
});

//This calls the function that closes the overlay
$(document).on("click", ".closeMenu", function() {
  chatRoomMenuClose();
});

var roomIsPrivate = false;

$("#roomCreatePrivate").on("click", function() {
  if (roomIsPrivate == false) {
    roomIsPrivate = true;
  } else if (roomIsPrivate == true) {
    roomIsPrivate = false;
  }
});

//myonoffswitch
var nightMode = false;

$("#nightMode").on("click", function() {
  if (nightMode == false) {
    nightMode = true;
  } else if (nightMode == true) {
    nightMode = false;
  }
});

//This calls the function that creates a chat room
$(document).on("click", "#roomCreateButton", function() {
  createChatRoom(roomIsPrivate);
});

//This calls the function that joins a chat room
$(document).on("click", "#roomJoinButton", function() {
  joinChatRoom();
});

var roomListOpen = false;

$("#joinListButton").on("click", function() {
  $(".menu").hide();
  $(".joinListDiv").show();
});

$("#closeListButton").on("click", function() {
  $(".joinListDiv").hide();
  $(".menu").show();
});

$(document).on("click", ".joinButton", function() {
  var parent = $(this).parent();
  var child = parent.find("h3").html();
  var username = $("#username").html();
  socket.emit("joinRoomAttempt", {
    user: username,
    crn: child
  });
  $("#overlay").hide();
  $(".joinListDiv").hide();
  currentRoom = child;
  joinedRoom = true;
  showInput();
});

function showInput() {
  $(".input-text-div").show();
}

$(".heading").on("click", function() {
  window.location.replace("../index.html");
});

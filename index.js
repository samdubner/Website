var hasSetUsername = false;

function sendMessage(){
	if(!hasSetUsername){
		alert("Please set a username");
		return;
	}	
	
	var textbubble = $(document.createElement("p"));
	var div = $(document.createElement("div"));
	div.addClass("right-align");
	//var textbubblel = $(document.createElement("p"));
	//var divl = $(document.createElement("div"));
	//divl.addClass("left-align");
	var usernameText = $(document.createElement("p"));
	var username = $("#username").html();
	var usernameText = username;
	var text = $("#textbox-text").val();
	text = text.replace(/\</g,"&lt;");
	if(text == ""){

	} else {
		//textbubblel.html(text);
		textbubble.html("<strong class = username-text>" + usernameText + ": " + "</strong>" + "<br>" + text);
		//textbubblel.addClass("bubble-left")
		textbubble.addClass("bubble-right");
		//divl.append(textbubblel);
		div.append(textbubble);
		//$(".text-display").append(divl);
		$(".text-display").append(div);
		$(".text-display").scrollTop($(".text-display")[0].scrollHeight);
		$("#textbox-text").val("");
	}
}

function setName(){
	var name = $("#textbox-name").val();
	if(name.length > 20){
		alert("Username must be less than or equal to 20 characters.");
		return;
	}
	var setName = $(document.createElement("h3"));
	setName.attr("id", "username")
	setName.addClass("username-text");
	name = name.replace(/\</g,"&lt;");
	setName.html(name);
	$(".enter-username").remove();
	$(".username-div").append(setName);
	
	hasSetUsername = true;
};

$("#textbox-text").on("keydown", function(e) {
	var text = $("#textbox-text").val();
	if(text == "" || text.split("")[0] == " " ){
		return;
	}
    if (e.which == 13) {
        e.preventDefault();
		$("#submit-button").trigger("click");
    }
});

$("#textbox-name").on("keydown", function(e) {
	var text = $("#textbox-name").val();
	if(text == "" || text.split("")[0] == " " ){
		return;
	}
    if (e.which == 13) {
        e.preventDefault();
		$("#submit-name").trigger("click");
    }
});

$(document).on("change keyup paste mouseup", "#textbox-text", function(){
	var text = $("#textbox-text").val();
	if(text == "" || text.split("")[0] == " " ){
		$("#submit-button").attr("disabled", true);
	} else{
		$("#submit-button").attr("disabled", false);
	}
});

$(document).on("change keyup paste mouseup", "#textbox-name", function(){
	var text = $("#textbox-name").val();
	if(text == "" || text.split("")[0] == " " ){
		$("#submit-name").attr("disabled", true);
	} else{
		$("#submit-name").attr("disabled", false);
	}
});

$("#submit-button").on("click", function(){
	sendMessage();
});

$("#submit-name").on("click", function(){
	setName();
})

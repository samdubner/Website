function sendMessage(){
	var textbubble = $(document.createElement("p"));
	var div = $(document.createElement("div"));
	div.addClass("right-align");
	var textbubblel = $(document.createElement("p"));
	var divl = $(document.createElement("div"));
	divl.addClass("left-align");
	var text = $("#textbox-text").val();
	if(text == ""){
		
	} else {
		textbubblel.html(text);
		textbubble.html(text);
		textbubblel.addClass("bubble-left")
		textbubble.addClass("bubble-right");
		divl.append(textbubblel);
		div.append(textbubble);
		$(".text-display").append(divl);
		$(".text-display").append(div);
		$(".text-display").scrollTop($(".text-display")[0].scrollHeight);
		$("#textbox-text").val("");
	}
}

function setName(){
	var setName = $(document.createElement("h3"));
	var name = $("#textbox-name").val();
	setName.html(name);
	$(".enter-username").remove();
	$(".username-div").append(setName);
}

$("#textbox-text").on("keydown", function(e) {
    if (e.which == 13) {
        e.preventDefault();
		$("#submit-button").trigger("click");
    }
});

$("#textbox-text").change(function(){
	
});
$(document).on("change keyup paste mouseup", "#textbox-text", function(){
	var text = $("#textbox-text").val();
	if(text == ""){
		$("#submit-button").attr("disabled", true);
	} else{
		$("#submit-button").attr("disabled", false);
	}
});

$("#submit-button").on("click", function(){
	sendMessage();
});

$("#submit-name").on("click", function(){
	setName();
})

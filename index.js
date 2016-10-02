function sendMessage(){
	var textBubble = $(document.createElement("p"));
	var div = $(document.createElement("div"));
	div.addClass("right-align");
	var text = $("#textbox-text").val();
	if(text.length > 190){
		alert("Your message is too long.");
	} else {
		if(text == "") {
			alert("Please do not send an empty message");
		} else {
			textBubble.html(text);
			textBubble.addClass("bubble");
			div.append(textBubble)
			$(".text-display").append(div);
			$(".text-display").scrollTop($(".text-display")[0].scrollHeight);
			$("#textbox-text").val("");
		}

	}

}

function setName(){
	var setName = $(document.createElement("h3"));
	var name = $("#textbox-name").val();
	setName.html(name);
	$(".enter-username").remove();
	$(".username-div").append(setName);
}

$('#textbox').on('keydown', function(e) {
    if (e.which == 13) {
        e.preventDefault();
		$("#submit-button").trigger("click");
    }
});

$("#submit-button").on("click", function(){
	sendMessage();
});

$("#submit-name").on("click", function(){
	setName();
})

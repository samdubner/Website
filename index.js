function sendMessage(){
	var textBubble = $(document.createElement("p"));
	var div = $(document.createElement("div"));
	div.addClass("right-align");
	var text = $("#textbox").val();
	textBubble.html(text);
	textBubble.addClass("bubble");
	div.append(textBubble)
	$(".text-display").append(div);
	$(".text-display").scrollTop($(".text-display")[0].scrollHeight);
	$("#textbox").val("");

	
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
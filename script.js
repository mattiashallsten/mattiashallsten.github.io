$(function(){
    $("#header").load("/assets/header.html"); 
});

$(function(){
    $("#footer").load("/assets/footer.html");		
});

function filterWorks(element, value) {
    $(".work").each(function() {
	let match = false;

	$(this).find(".work-tags div").each(function() {
	    if($(this).text() == value || value == "all") {
		match = true;
	    }
	})

	if(match) {
	    $(this).show();
	} else {
	    $(this).hide();
	}
    })
}

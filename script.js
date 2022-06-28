$(function(){
    $("#header").load("/assets/header.html"); 
});

$(function(){
    $("#footer").load("/assets/footer.html");		
});

function loadWorks (url) {
    let mdRegexp = new RegExp('.*\.md$');

    let workTags = {all: 0};
    let works = [];

    // Create work container
    let container = $('<div>');
    container.addClass('work-container');

    $.ajax({
	async: false,
	type: 'GET',
	url: url,
	success: (data) => {
	    console.log(data);
	    $(data).filter("ul").find("li > a").each(function() {
		let name = $(this).text().trim();
		
		if(mdRegexp.test(name)) {

		    $.ajax({
			async: false,
			type: 'GET',
			url: url + name,
			success: (data) => {
			    works.push(parseWork(data, name, workTags));
			}
		    });
		}
	    });
	}
    });

    console.log(works);

    // Add selector
    let selectorContainer = $('<div>');
    let selector = $('<select id="tags-selector" onchange="filterWorks(this, value)">');
    selectorContainer.addClass("tags-selector-container");
    selectorContainer.append('<div style="font-weight:300">Filter by category:</div>');
    selectorContainer.append(selector);

    let selectorContent = "";
    
    for(let tag in workTags) {
	selectorContent += '<option value="' + tag + '">' +
			   tag + ' (' + workTags[tag] + ')</option>';
    }

    selector.append(selectorContent);

    $("#body").append(selectorContainer);
    
    // End by appending the container
    $("#body").append(container);

    works.map(w => container.prepend(workAsDiv(w)));
}

function parseWork(input, name, workTags) {
    let data = {name: name};
    let arr = input.split("\n");

    if(arr[0] == "---") {
	parseFrontMatter(arr, data, workTags);
    }

    parseMarkdown(arr, data);

    return data;
}

function parseFrontMatter(input, data, workTags) {
    input.shift();

    while( input[0] != "---" && input.length > 0 ) {
	let keyVal = input.shift().split(":");
	let key = keyVal[0].trim();
	let val = keyVal[1].trim();

	if(val == "" && input[0][0] == "\t") {
	    val = parseYamlList(input);
	}

	if(key == "tags") {
	    if(!Array.isArray(val)) {
		val = Array(val)
	    }

	    for(let i = 0; i < val.length; i++) {
		if(val[i] in workTags) {
		    workTags[val[i]] += 1;
		} else {
		    workTags[val[i]] = 1
		}
	    }

	    workTags["all"] += 1;
	}

	data[key] = val;


    }

    if(input[0] == "---") {
	input.shift();
    }
}

function parseYamlList (input) {
    let arr = [];

    while (input.length > 0) {
	if(input[0][0] != "\t") {
	    return arr;
	}

	let line = input.shift().substr(1);
	if (line[0] == "-") {
	    arr.push(line.substr(1).trim())
	}
    }
}

function parseMarkdown(input, data) {
    let str = "";

    for(let i = 0; i < input.length; i++) {
	str += input[i] + "\n";
    }

    let parsed = marked.parse(str, {
	smartLists: true,
	smartypants: true
    });
    let tree = $('<div>' + parsed + '</div>');

    data['body'] = tree.html();
}

function parseArrayToDivs (array) {
    return array.map(e => '<div>' + e).join('</div>') + '</div>'
}

function workAsDiv(work) {
    let main = $('<div>');
    let left = $('<div>');
    let right = $('<div class>');

    main.addClass("work");
    left.addClass("work-left");
    right.addClass("work-right");
    
    main.append(left);
    main.append(right);

    let leftContent = "";
    let rightContent = "";

    if( "date" in work ) {
	leftContent += '<div class="work-date">' + work.date + '</div>';
    }

    if( "tags" in work) {
	let t = work.tags;

	leftContent += '<div class="work-tags">' + parseArrayToDivs(t) + '</div>';
    }

    if( "title" in work ) {
	rightContent += '<div class="work-title">' + work.title + '</div>';
    }
    
    if( "subtitle" in work ) {
	rightContent += '<div class="work-subtitle">' + work.subtitle + '</div>'
    }

    if( "desc" in work ) {
	rightContent += '<div class="work-desc">' + work.desc + '</div>';
    }

    if( "body" in work ) {
	rightContent += '<div class="work-body">' + work.body + '</div>';
    }

    left.append(leftContent);
    right.append(rightContent);
    

    return main;
}

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

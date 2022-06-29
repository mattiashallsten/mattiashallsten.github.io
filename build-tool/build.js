const marked = require('marked')
const fs = require('fs')
const yargs = require('yargs')
const yamlFront = require('yaml-front-matter')

const argv = yargs
    .option('input', {
	alias: 'i',
	description: 'Input directory',
	type: 'string'
    })
    .option('output', {
	alias: 'o',
	description: 'Output file',
	type: 'string'
    }).argv;

if (!(argv.output && argv.input)) {
    console.log("Supply both output and input!");
    process.exit(1);
}

const inputDir = argv.input;
const output = argv.output;



let fileNames = fs.readdirSync(inputDir).filter(f => f.endsWith(".md")).reverse();
let files = fileNames.map(p => fs.readFileSync(inputDir + p, 'utf-8')).map((d, i) => {
    let obj = yamlFront.loadFront(d);
    obj["name"] = fileNames[i];
    return obj;
});

let pageTags = {"all": files.length};

let filesHtml = files.map(f => {
    let left = '<div class="work-left">'; // Open left div

    if (f.date) {
	left += '<div class="work-date">' + f.date + '</div>';
    }

    if (f.tags) {
	if(!Array.isArray(f.tags)) {
	    f.tags = Array(f.tags);
	}

	left += '<div class="work-tags">';

	for(let i = 0; i < f.tags.length; i++) {
	    left += '<div>' + f.tags[i] + '</div>';

	    if(pageTags[f.tags[i]]) {
		pageTags[f.tags[i]] += 1
	    } else {
		pageTags[f.tags[i]] = 1
	    }
	}

	left += '</div>';
    }

    left += '</div>'; // Close left div

    let right = '<div class="work-right">'; // Open right div

    if (f.title) {
	right += '<div class="work-title">' + f.title + '</div>';
    }

    if (f.subtitle) {
	right += '<div class="work-subtitle">' + f.subtitle + '</div>';
    }

    if (f.desc) {
	right += '<div class="work-desc">' + f.desc + '</div>';
    }

    if (f.__content) {
	right += '<div class="work-body">' +
		 marked.parse(f.__content, {
		     smartLists: true,
		     smartypants: true,
		 }) +
		 '</div>';
    }

    if (f.youtube) {
	right += '<div class="youtube-container">' +
		 '<iframe class="youtube" src="https://www.youtube.com/embed/' +
		 f.youtube +
		 '" allowfullscreen></iframe></div>';
    }

    if (f.soundcloud) {

	right += '<div class="soundcloud-container"><iframe width="100%" height="166" scrolling="no"' + 
		 'frameborder="no"' +
		 'src="https://w.soundcloud.com/player/?url=https%3A/' +
		 '/api.soundcloud.com/tracks/' + f.soundcloud +
		 '&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>' +
		 '</div>'
    }

    if (f.vimeo) {
	right += '<div class="vimeo-container"><div style="padding:56.25% 0 0 0;position:relative;">' +
		 '<iframe src="https://player.vimeo.com/video/' +
		 f.vimeo +
		 '?h=5efc670107&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"' + 
		 'frameborder="0"; fullscreen;picture-in-picture"' +
		 'allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;"' +
		 'title="Play it yourself">'+ 
		 '</iframe></div>' +
		 '<script src="https://player.vimeo.com/api/player.js"></script>' +
		 '</div>';
    }

    right += '</div>'; // Close right div

    return '<div class="work" id="' + f.name.replace(".md", "") + '">' + left + right + '</div>';    
});

let selector = '<div class="tags-selector-container">' +
	       '<div style="font-weight:300">Filter by category:</div>' +
	       '<select id="tags-selector" onchange="filterWorks(this, value)">';

for(let tag in pageTags) {
    selector += '<option value="' + tag + '">' +
		tag + ' (' + pageTags[tag] + ')</option>';
}

selector += '</select></div>';

fs.writeFileSync(output, '<div class="work-container">' + selector + filesHtml.join("") + '</div>');

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
let files = fileNames.map(p => fs.readFileSync(inputDir + p, 'utf-8')).map(d => yamlFront.loadFront(d));

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

    right += '</div>'; // Close right div

    return '<div class="work">' + left + right + '</div>';    
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

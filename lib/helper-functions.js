/*exports.generatecURL = function(options){
	//echo curl -H "Authorization:Basic $credentials" "$url/v1/organizations/$org/apis/$application/revisions" -X GET
	var optionsl = JSON.parse(JSON.stringify(options));
	var curl = require('curl-cmd');
	optionsl.auth = optionsl.auth.user + ":" + optionsl.auth.password
	optionsl.hostname = options.uri.replace('https://', '')
	optionsl.path = optionsl.hostname.substring(optionsl.hostname.indexOf('/'));
	optionsl.hostname = optionsl.hostname.replace(optionsl.path, '')
	console.log(curl.cmd(optionsl, {ssl: true, verbose: true}));
}*/

exports.generatecURL = function (options) {
	var curl = 'curl';
	var method = (options.method || 'GET').toUpperCase();
	var body = options.body || {};
	var uri = options.uri;

	//curl - add the method to the command (no need to add anything for GET)
	if (method === 'POST') {curl += ' -X POST'; }
	else if (method === 'PUT') { curl += ' -X PUT'; }
	else if (method === 'DELETE') { curl += ' -X DELETE'; }
	else { curl += ' -X GET'; }

	//curl - append the path
	curl += ' ' + uri;

	//curl - add the body
	body = JSON.stringify(body); //only in node module
	if (body !== '"{}"' && method !== 'GET' && method !== 'DELETE') {
	  //curl - add in the json obj
	  curl += " -d '" + body + "'";
	}
	//log the curl command to the console
	console.log(curl);
	return curl;
};

exports.setNodeResources = function(options, files){
	var fs = require('fs');	
	var task = {};
	if (fs.existsSync('./node')) {
		task.options = options;
		task.files = files
	}
	return task;
}
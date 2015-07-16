var request = require('request');
var helper = require('./helper-functions.js');

exports.npmInstallRevision = function (apigee_profiles, revision, callback, includeCurl) {
	var apigeel = apigee_profiles[apigee_profiles.env];

	var options = {
		method: 'POST',
		uri: apigeel.url_mgmt + '/v1/o/' + apigeel.org + '/apis/' + apigeel.apiproxy + '/revisions/' + revision + '/npm',
		auth: {
			user: apigeel.username,
			password: apigeel.password
		},
		headers : {
			'Content-Type' : 'application/x-www-form-urlencoded',
		},
		body:'command=install'
	};
	if(includeCurl)
		helper.generatecURL(options);

	request(options, callback);
};

exports.getDeployedApiRevisions = function (apigee_profiles, callback, includeCurl) {
	var apigeel = apigee_profiles[apigee_profiles.env];
	//echo curl -H "Authorization:Basic $credentials" "$url/v1/organizations/$org/apis/$application/revisions/$RevToUndeploy/deployments" -X GET
	var options = {
		method: 'GET',
		uri: apigeel.url_mgmt + '/v1/o/' + apigeel.org + '/environments/' + apigeel.env + '/apis/' + apigeel.apiproxy + '/deployments',
		auth: {
			user: apigeel.username,
			password: apigeel.password
		}
	};
	if(includeCurl)
		helper.generatecURL(options);
	request(options, callback);
};

exports.undeployApiRevision = function(apigee_profiles, revision, callback, includeCurl){
	//echo curl -H "Authorization:Basic $credentials" "$url/v1/organizations/$org/apis/$application/revisions/$RevToUndeploy/deployments?action=undeploy&env=$environment" -X POST -H "Content-Type: application/octet-stream"
	var apigeel = apigee_profiles[apigee_profiles.env];
	var options = {
		method: 'POST',
		uri: apigeel.url_mgmt + '/v1/o/' + apigeel.org + '/apis/' + apigeel.apiproxy + '/revisions/' + revision + "/deployments?action=undeploy&env=" + apigeel.env,
		auth: {
			user: apigeel.username,
			password: apigeel.password
		},
		headers : {
			'Content-Type' : 'application/octet-stream',
		},
	};
	if(includeCurl)
		helper.generatecURL(options);
	request(options, callback);
}

exports.deployApiRevision = function(apigee_profiles, revision, callback, includeCurl){
	//echo curl -H "Authorization:Basic $credentials" "$url/v1/organizations/$org/apis/$application/revisions/$RevToDeploy/deployments?action=deploy&env=$environment" -X POST -H "Content-Type: application/octet-stream"
	//curl -X POST -H 'Content-type:application/x-www-form-urlencoded' https://api.enterprise.apigee.com/v1/o/testmyapi/environments/test/apis/forecastweather-grunt-plugin-api/revisions/86/deployments\?override\=true\&delay\=10
	var apigeel = apigee_profiles[apigee_profiles.env];
	var options = {
		method: 'POST',
		uri: apigeel.url_mgmt + '/v1/o/' + apigeel.org + '/e/' + apigeel.env + '/apis/' + apigeel.apiproxy + '/revisions/' + revision + '/deployments' + (apigeel.override ? '?override=true' : '') + ((apigeel.override && apigeel.delay != 0) ? '&delay=' + apigeel.delay : ''),
		auth: {
			user: apigeel.username,
			password: apigeel.password
		},
		headers : {
			'Content-Type' : 'application/x-www-form-urlencoded',
		},
	};
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

exports.getAllApiRevisions = function(apigee_profiles, callback, includeCurl){
	//echo curl -H "Authorization:Basic $credentials" "$url/v1/organizations/$org/apis/$application/revisions" -X GET
	var apigeel = apigee_profiles[apigee_profiles.env];
	var options = {
		method: 'GET',
		uri: apigeel.url_mgmt + '/v1/o/' + apigeel.org + '/apis/' + apigeel.apiproxy + '/revisions',
		auth: {
			user: apigeel.username,
			password: apigeel.password
		},
		headers : {
			'Content-Type' : 'application/octet-stream',
		},
	};
	if(includeCurl)
		helper.generatecURL(options);
	request(options, callback);
}

exports.deleteApiRevision = function(apigee_profiles, revision, callback, includeCurl){
	//echo -H "Authorization:Basic $credentials" -X DELETE "$url/v1/organizations/$org/apis/$application/revisions/$RevToUndeploy"
	var apigeel = apigee_profiles[apigee_profiles.env];
	var options = {
		method: 'DELETE',
		uri: apigeel.url_mgmt + '/v1/o/' + apigeel.org + '/apis/' + apigeel.apiproxy + '/revisions/' + revision,
		auth: {
			user: apigeel.username,
			password: apigeel.password
		},
		headers : {
			'Content-Type' : 'application/octet-stream',
		},
	};
	if(includeCurl)
		helper.generatecURL(options);
	request(options, callback);
}

exports.updateApiRevision = function(apigee_profiles, revision, callback, includeCurl){
	//echo -H "Authorization:Basic $credentials" -X DELETE "$url/v1/organizations/$org/apis/$application/revisions/$RevToUndeploy"
	var apigeel = apigee_profiles[apigee_profiles.env];
	var fs = require('fs');
	var rs = fs.createReadStream('target/' + apigeel.apiproxy + '.zip');
	var options = {
		method: 'POST',
		uri: apigeel.url_mgmt + '/v1/o/' + apigeel.org + '/apis/' + apigeel.apiproxy + '/revisions/' + revision + '?validate=true',
		auth: {
			user: apigeel.username,
			password: apigeel.password
		},
		headers : {
			'Content-Type' : 'application/octet-stream',
			'Accept-Encoding' : 'gzip,deflate'
		},
		strictSSL: false
	};
	if(includeCurl)
		helper.generatecURL(options);
	rs.pipe(request(options, callback));
}


exports.importApiBundle = function(apigee_profiles, callback, includeCurl){
		var apigeel = apigee_profiles[apigee_profiles.env];
		var fs = require('fs');
		var rs = fs.createReadStream('target/' + apigeel.apiproxy + '.zip');
		var options = {
			method: 'POST',
			uri: apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + '/apis?action=import&name=' + apigeel.apiproxy,
		 	//uri: apigeel.url_mgmt + '/v1/o/' + apigeel.org + '/apis/' + apigeel.apiproxy + '/revisions',
			auth: {
				user: apigeel.username,
				password: apigeel.password
			},
			headers : {
				'Content-Type' : 'application/octet-stream',
			},
			strictSSL: false
		};
		if(includeCurl)
			helper.generatecURL(options);
		rs.pipe(request(options, callback));
}

exports.getKVMsEnvironment = function(apigee_profile, callback, includeCurl){
	var apigeel = apigee_profile;//apigee_profiles[apigee_profiles.env];
	var options = {
      uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/environments/" + apigeel.env + "/keyvaluemaps",
      method : 'GET',
      auth : {user : apigeel.username, password: apigeel.password}
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

//TODO fix all to use single profile
exports.getKVMsOrganization = function(apigee_profiles, callback, includeCurl){
	var apigeel = apigee_profiles;//[apigee_profiles.env];
	var options = {
      uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/keyvaluemaps",
      method : 'GET',
      auth : {user : apigeel.username, password: apigeel.password}
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

exports.updateKVMsEnvironment = function(apigee_profiles, kvm, callback, includeCurl){
	var apigeel = apigee_profiles[apigee_profiles.env];
	var options = {
		uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/environments/" + apigeel.env + "/keyvaluemaps/" + kvm.name,
		method : 'PUT',
		auth : {user : apigeel.username, password: apigeel.password},
		headers : {'Content-Type': 'application/json'},
		body: JSON.stringify(kvm)
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

exports.updateKVMsOrganization = function(apigee_profiles, kvm, callback, includeCurl){
	var apigeel = apigee_profiles[apigee_profiles.env];
	var options = {
		uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/keyvaluemaps/" + kvm.name,
		method : 'PUT',
		auth : {user : apigeel.username, password: apigeel.password},
		headers : {'Content-Type': 'application/json'},
		body: JSON.stringify(kvm)
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

exports.createKVMsEnvironment = function(apigee_profiles, kvm, callback, includeCurl){
	var apigeel = apigee_profiles[apigee_profiles.env];
	var options = {
		uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/environments/" + apigeel.env + "/keyvaluemaps",
		method : 'POST',
		auth : {user : apigeel.username, password: apigeel.password},
		headers : {'Content-Type': 'application/json'},
		body: JSON.stringify(kvm)
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

exports.createKVMsOrganization = function(apigee_profiles, kvm, callback, includeCurl){
	var apigeel = apigee_profiles[apigee_profiles.env];
	var options = {
		uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/keyvaluemaps",
		method : 'POST',
		auth : {user : apigeel.username, password: apigeel.password},
		headers : {'Content-Type': 'application/json'},
		body: JSON.stringify(kvm)
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

//TODO fix all to use single profile
exports.getKVMEnvironment = function(apigee_profile, kvmName, callback, includeCurl){
	var apigeel = apigee_profile;
	var options = {
      uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/environments/" + apigeel.env + "/keyvaluemaps/" + kvmName,
      method : 'GET',
      auth : {user : apigeel.username, password: apigeel.password}
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

//TODO fix all to use single profile
exports.getKVMOrganization = function(apigee_profile, kvmName, callback, includeCurl){
	var apigeel = apigee_profile;
	var options = {
      uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/keyvaluemaps/" + kvmName,
      method : 'GET',
      auth : {user : apigeel.username, password: apigeel.password}
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

exports.getKVM = function(apigee_profile, kvmName, type, callback, includeCurl){
	var apigeel = apigee_profile;
	var options = {
      uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + ( type === 'env' ? "/environments/" + apigeel.env : "" )+ "/keyvaluemaps/" + kvmName,
      method : 'GET',
      auth : {user : apigeel.username, password: apigeel.password}
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

exports.getKVMList = function(apigee_profile, type, callback, includeCurl){
	var apigeel = apigee_profile;
	var options = {
      uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + ( type === 'env' ? "/environments/" + apigeel.env : "" ) + "/keyvaluemaps",
      method : 'GET',
      auth : {user : apigeel.username, password: apigeel.password}
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}
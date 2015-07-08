var stdin = require('get-stdin');
var exitCode = 0;
var args = require('minimist')(process.argv.slice(1));
var fs = require('fs');
function isInt(n){
	return Number(n)===n && n%1===0;
}

function isFloat(n){
	return n===Number(n)  && n%1!==0;
}

function isArray(myArray) {
	return myArray.constructor.toString().indexOf("Array") > -1;
}

function sksort(array, key) {
	return array.sort(function(a, b) {
		var x = a[key];
		var y = b[key];

		if (typeof x == "string")
		{
			x = x.toLowerCase(); 
			y = y.toLowerCase();
		}
		if (x == parseInt(x)) {
			x= parseInt(x);
			y= parseInt(y);
		}
		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	});
}

function generateView(model, modelName, dirView, callback) {	
	fs.exists(dirView+'/'+modelName.toLowerCase(), function(exists) {
	    if (!exists) {
	       	fs.mkdir(dirView+'/'+modelName.toLowerCase(), function(error) {
				 if(error){
				 	console.log('Failed to create Directory' + dirView+'/'+modelName.toLowerCase());
				 }else{
				 	console.log('Directory '+dirView+'/'+modelName.toLowerCase()+' successfuly created');
				 }
			});
	    }
	    callback(modelName);    	    	    	   
	});				
}

function generateController(model, modelName, callback) {
	var content = fs.readFile('samples/controller.js','utf-8',function(err,data) {
		data = data.replace('{CONTROLLER}',modelName.toLowerCase()+"Controller").replace(new RegExp('{MODEL}','g'),modelName);
		var fields = "";
		for (var objName in model.attributes) {
			objValue = model.attributes[objName];
			fields += objName+":"+objName+',';
		}
		fields = fields.substring(0,fields.length -1);
		data = data.replace(new RegExp('{FIELDS}','g'),fields);
		callback(data);
	})
}

stdin(function(data) {
	if (args.help || args.h) {
		var helpPath = 'doc/doc.txt';
		var ajuda = fs.readFile(helpPath,'utf-8',function (err,data) {
			console.error(data);	
		});
	}

	if (args.version) {
		var pkg = require('./package.json');
		console.error(pkg.name + ' v' + pkg.version);
	}

	if (args.d || args.dest) {
		var dest = (args.d != "") ? args.d : args.dest;
		var dirView = "";
		var dirController = "";
		if (isArray(dest)) {
			dest.forEach(function(e) {
				var aux = e.split(':');
				if (aux[0] == 'controller') {
					dirController = aux[1];
				}
				if (aux[0] == 'view') {
					dirView = aux[1];
				}
			});
		} else {
			var aux = dest.split(':');
			if (aux[0] == 'controller') {
				var dirController = aux[1];
			}
			if (aux[0] == 'view') {
				var dirView = aux[1];
			}
		}
	} else {
		console.log('Option -d is required');
		return;
	}

	if (args.f || args.file){
		var file = (args.f != "") ? args.f : args.file;
		var model = require(file);
		var aux = file.split('/');
		var modelName = aux[aux.length -1].replace('.js','');

		if (args.t || args.type) {
			if (args.t != "" || args.type != "") {
				var type = (args.t != "") ? args.t : args.type;
			}

			if (args.a || args.all) {

				generateView(model, modelName, dirView, function(data) {
					fs.writeFile(dirView+'/'+modelName.toLowerCase()+'/'+'index.ejs',"teste",function(err) {
						if (!err) {
							console.log('File '+dirView+'/'+modelName.toLowerCase()+'/'+'index.ejs successfuly created');
						} else {
							console.error('Error when create view file '+dirView+'/'+modelName.toLowerCase()+'/'+'index.ejs');
							console.error(err);
						}
					});						
				});

				generateController(model,modelName, function(data) {
					fs.writeFile(dirController+'/'+modelName+'Controller.js',data,function(err) {
						if (!err) {
							console.log('File '+dirController+'/'+modelName+'Controller.js successfuly created');
						} else {
							console.error('Error when create controller file');
						}
					});
				});

			} else {
				if (args.v || args.view) {
					generateView(model, modelName, dirView, function(data) {
						fs.writeFile(dirView+'/'+modelName.toLowerCase()+'/'+'index.ejs',"teste",function(err) {
							if (!err) {
								console.log('File '+dirView+'/'+modelName.toLowerCase()+'/'+'index.ejs successfuly created');
							} else {
								console.error('Error when create view file '+dirView+'/'+modelName.toLowerCase()+'/'+'index.ejs');
								console.error(err);
							}
						});						
					});
				} else {
					console.error('You cannot use this option with -t option');	
				}
			}

		} else {
			if (args.c || args.controller) {
				generateController(model,modelName, function(data) {
					fs.writeFile(dirController+'/'+modelName+'Controller.js',data,function(err) {
						if (!err) {
							console.log('File '+dirController+'/'+modelName+'Controller.js successfuly created');
						} else {
							console.error('Error when create controller file');
						}
					});
				});
			} else {
				console.error("You need to set an option");
			}
		}
	} else {
		console.error("You need set a file");
	}

});


var fs = require('fs')
var fsp = require('fs-plus')
var Command = require('./command.js').Command
var path = require('path')
var Builder = {}
Builder.steps = {}
Builder.modes = {}
Builder.config = {}


var old = console.log;
console.log = function () {
    Array.prototype.unshift.call(arguments, 'Debug: ');
	fs.appendFile('log.txt', arguments[1] + "\r\n", function (err) {

	});
    old.apply(this, arguments)
}


//=-=-=-=-=-=-=CONFIG=-=-=-=-=-=-=
Builder.config.defaultDevice = "vivoactive"									/* device type */
Builder.config.sdkPath = 'D:\\development\\connectiq-sdk-win-1.1.1'   		/* path to ConnectIQ sdk */
Builder.config.javaLocation = 'C:\\Program Files (x86)\\Java\\jre1.8.0_40'  
Builder.config.defaultDeviceLocation = "K:\\" 								/* directory your device can be located */
Builder.config.verbose = true 					    						/* log build steps to console */	
Builder.config.removeBatchFiles = false										/* Remove batch files for building and launching */


/* Enhance the simulator outputs! */

Builder.config.echoSimulator = false			/* log simulator output to console */
Builder.config.logSimulator = true				/* write simulator output to file */
Builder.config.timestampSimulatorLines = true	/* prepend timestamps to simulator lines */
//--------------------------------

Builder.exec = function (mode, parameters, cb) {
	console.log("Building")

	var whenDone = function () { return cb() } /* lets go home */

	switch (mode) {
		case "deploy":
			Builder.modes.deploy(parameters, whenDone)
			break
		case "simulator":
			Builder.modes.simulator(parameters, whenDone)
			break
	}
}

Builder.build = function (command, cb) {
	var spawn = require('child_process').spawn
	var batchFile = path.resolve(__dirname, 'build.bat')
	fsp.writeFile(batchFile,'java'+command,null,function(){
		var prc = spawn(batchFile)
	
		//console.log('java'+command)
		
		prc.stdout.setEncoding('utf8')
	
		prc.stdout.on('data', function (data) {
			var str = data.toString()
			var lines = str.split(/(\r?\n)/g);
			console.log(lines.join(""));
		})
	
		prc.on('close', function (code) {
			console.log('process exit code ' + code)				
			if (Builder.config.removeBatchFiles) { fsp.removeSync(batchFile) }
			return cb()
		})
	})	
}

Builder.launchSimulator = function (cb) {
	var batchFile = path.resolve(__dirname, 'runSimulator.bat')
	var simulatorFile = path.resolve(Builder.config.sdkPath ,'bin/simulator.exe')
	fsp.writeFile(batchFile,simulatorFile,null,function(){
		var spawn = require('child_process').spawn	
		
		var prc = spawn(batchFile)
		prc.on('close', function (code) {
			console.log('process exit code ' + code)						
		})
		if (Builder.config.removeBatchFiles) { fsp.removeSync(batchFile) }
		return cb()	
	})
}

Builder.simulate = function (prg,cb) {
	var batchFile = path.resolve(__dirname, 'simulate.bat')
	fsp.writeFile(batchFile,'monkeydo '+'"'+prg+'"',null,function(){
		var spawn = require('child_process').spawn	
		
		var prc = spawn(batchFile)
		
		prc.stdout.setEncoding('utf8')
	
		prc.stdout.on('data', function (data) {
			var str = data.toString()
			var lines = str.split(/(\r?\n)/g);
			console.log(lines.join(""));
		})
	
		prc.on('close', function (code) {
			console.log('process exit code ' + code)			
		})
		
		if (Builder.config.removeBatchFiles) { fsp.removeSync(batchFile) }
		return cb()			
		
	})
}

function traverse(path) {
	fsp.traverseTreeSync(path, function (file) {
		console.log(file)
	}, function (path) {
			traverse(path)
		})
}

Builder.steps.copySourceToBuildSourceDirectory = function (cb) {
	if (Builder.config.verbose) console.log("copying source to build directory")

	var home = path.resolve(__dirname, '../src/')
	var toBuild = path.resolve(__dirname, 'incoming/')
	fsp.copySync(home, toBuild)
	console.log("Copying")

	return cb()
}

Builder.steps.buildForDevice = function (device, cb) {
	if (Builder.config.verbose) console.log("building for device")
	Command.exec(Builder.config, function (cmd) {
		console.log("command")
		console.log(cmd)
		try {
			Builder.build(cmd, function () {
				return cb()
			})
		} catch (e) {
			console.log(e)
		}
		
	})
}
Builder.steps.launchBuildInSimulator = function (device, cb) {
	if (Builder.config.verbose) console.log("launching in simulator")
	var prg = path.resolve(__dirname, 'outgoing/out.prg')
	
	Builder.launchSimulator(function(){
		console.log("simulator started")
		Builder.simulate(prg, function(){
			console.log("simulation started")
			return cb()
		})
	})		
}
Builder.steps.deployBuildToDevice = function (device, cb) {
	if (Builder.config.verbose) console.log("deploying now")
	var prg = path.resolve(__dirname, 'outgoing/')
	var toDevice = path.resolve(Builder.config.defaultDeviceLocation, 'GARMIN/APPS/')
	try {
		fsp.copySync(prg, toDevice)
	} catch(e) {
		console.log(e)
	}
	return cb()
}
Builder.steps.cleanUpBuildSourceDirectory = function (cb) {
	if (Builder.config.verbose) console.log("removing source after compile")
	var toBuild = path.resolve(__dirname, 'incoming/')
	fsp.removeSync(toBuild)
	return cb()
}
Builder.modes.simulator = function (parameters, cb) {
	if (Builder.config.verbose) console.log("Deploying to simulator")
	commonSteps(Builder.steps.launchBuildInSimulator, parameters, function () {
		return cb()
	})
}
Builder.modes.deploy = function (parameters, cb) {
	if (Builder.config.verbose) console.log("Deploying to device")
	commonSteps(Builder.steps.deployBuildToDevice, parameters, function () {
		return cb()
	})
}
function commonSteps(uniqueStep, parameters, cb) {
	var target = parameters.device || Builder.config.defaultDevice
	Builder.steps.cleanUpBuildSourceDirectory(function () {
		//copy source to build
		Builder.steps.copySourceToBuildSourceDirectory(function () {		
			//init build
			Builder.steps.buildForDevice(target, function () {
				//deploy or simulate
				uniqueStep(target, function () {					
					//go home we are done
					return cb()
				})
			})
		})
	})
}

exports.Builder = Builder

var arguments = process.argv.slice(2);

/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=AutoExec=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
*                   This gets executed upon launch 
*    An optional object of parameters can be sent as the second arg
*              Second argument defaults to empty object {}
*
*                        ----=Example=----
* ..."configurations": [...
* ...    // Command line arguments passed to the program.
* "args": ['simulator','{device: "foodevice", drive: "x:/"}'],...
---------------------------------------------------------------------*/
Builder.exec(arguments[0], arguments[1] || {}, function () {
	console.log("Complete")
})


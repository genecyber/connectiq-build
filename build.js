var fs = require('fs-extra')
var Builder = {}
Builder.steps = {}
Builder.modes = {}

//=-=-=-=-=-=-=CONFIG=-=-=-=-=-=-=
	var defaultDevice = "vivoactive"		/* device type */
	var sdkPath = "D:\development\connectiq-sdk-win-1.1.0"						/* path to ConnectIQ sdk */
	var defaultDeviceLocation = "K" 		/* directory your device can be located */
	var verbose = true 					/* log build steps to console */
	var removeCsExtensions = true			/* changing file extensions to cs offers syntax hilighting in IDE's outside of eclipse */
	
	/* Enhance the simiulator outputs! */
		var echoSimulator = false			/* log simulator output to console */
		var logSimulator = true				/* write simulator output to file */
		var timestampSimulatorLines = true	/* prepend timestamps to simulator lines */
//--------------------------------

Builder.exec = function(mode, parameters, cb){
	console.log("Building")
	
	var whenDone = function(){ return cb() } /* lets go home */
	
	switch(mode) {
		case "deploy":
			Builder.modes.deploy(parameters, whenDone)
			break
		case "simulator":
			Builder.modes.simulator(parameters, whenDone)
			break	
	}
}

Builder.steps.copySourceToBuildSourceDirectory = function(cb){
	if (verbose) console.log("copying source to build directory")
	
	return cb()
}
Builder.steps.removeCsExtension = function(cb){
	if (!removeCsExtensions) return cb() 	/* if we don't want to do this lets return */
	
	if (verbose) console.log("removing cs extension")
	
	var files = fs.readdirSync("./")
	return cb()
}
Builder.steps.buildForSimulator = function(cb){
	if (verbose) console.log("building for simulator")
	
	return cb()
}
Builder.steps.buildForDevice = function(device, cb){
	if (verbose) console.log("building for device")
	
	return cb()
}
Builder.steps.moveBuildToOutgoingDirectory = function(cb){
	if (verbose) console.log("moving things to outgoing")
	
	return cb()
}
Builder.steps.launchBuildInSimulator = function(device, cb){
	if (verbose) console.log("launching in simulator")
	
	return cb()
}
Builder.steps.deployBuildToDevice = function(device, cb){
	if (verbose) console.log("deploying now")
	
	return cb()
}


Builder.steps.cleanUpBuildSourceDirectory = function(cb){
	if (verbose) console.log("removing source after compile")
	
	return cb()
}

Builder.modes.simulator = function(parameters, cb){
	if (verbose) console.log("Deploying to simulator")	
	commonSteps(Builder.steps.launchBuildInSimulator, parameters, function(){
		return cb()
	})
}

Builder.modes.deploy = function(parameters, cb){
	if (verbose) console.log("Deploying to device")	
	commonSteps(Builder.steps.deployBuildToDevice, parameters, function(){
		return cb()
	})
}

function commonSteps(uniqueStep, parameters, cb){
	var target = parameters.device || defaultDevice
	//copy source to build
	Builder.steps.copySourceToBuildSourceDirectory(function(){
		//remove cs extensions
		Builder.steps.removeCsExtension(function(){
			//init build
			Builder.steps.buildForDevice(target,function(){
				//move to outgoing
				Builder.steps.moveBuildToOutgoingDirectory(function(){
					//deploy or simulate
					uniqueStep(target, function(){
						//cleanup
						Builder.steps.cleanUpBuildSourceDirectory(function(){
							//go home we are done
							return cb()
						})
					})
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


Builder.exec(arguments[0], arguments[1] || {}, function(){
		console.log("Complete")
})



var fs = require('fs-plus')
var path = require('path')
var Command = {}
var Settings = {}
var Resources = []
Command.exec = exec
exports.Command = Command

function exec(settings, cb){
	Settings = settings
	generateBuildCommand(function(data){
		return cb(data)
	})
}
var compileString = ""
function generateBuildCommand(callback){	
	//compileString += generateJavaString()
	compileString += generateClassPathString()
	compileString += generateAPIImportFileString()
	compileString += generateDeviceString()
	//compileString += generateBatchFile()
	compileString += generateOutputFileString()
	generateResourceString(function(resources){
		compileString += resources
		compileString += generateManifestString()
		//compileString += generateDeviceString()
		generateCodeFilesString(function(files){
			compileString += files
			compileString += generateTargetDeviceNameString()
			callback(compileString)
		})		
	})	
}

/*function generateBatchFile() {
	return 'monkeyc'
}*/
function generateJavaString() {
	return Settings.javaLocation+"\\bin\\java -Dfile.encoding=UTF-8 -Dapple.awt.UIElement=true"
}
function generateClassPathString() {
	return  ' -cp "'+Settings.sdkPath+'\\bin\\monkeybrains.jar"; com.garmin.monkeybrains.Monkeybrains'
}
function generateAPIImportFileString() {
	return ' -a "'+Settings.sdkPath+'\\bin\\api.db"'
}
function generateDeviceString() {
	return " -u "+Settings.sdkPath+"\\bin\\devices.xml"
}

function generateOutputFileString() {
	var outDir  = path.resolve(__dirname, 'outgoing/out.prg')
	return " -o "+ outDir
}

function generateResourceString(cb) {
	var	returnValue = " -z "
	var toBuild = path.resolve(__dirname, 'incoming/resources/')
	CustomTraverse(toBuild,['.xml'],function(files) {
		return cb(returnValue + files.join(';'))
	})
	
}

function generateCodeFilesString(cb) {
	var	returnValue = " -p "+Settings.sdkPath+"\\bin\\projectInfo.xml "
	var toBuild = path.resolve(__dirname, 'incoming/')
	try {
		CustomTraverse(toBuild,['.mc'],function(files) {
			return cb(returnValue + files.join(' '))
		})
	} catch(e) {
		console.log(e)
	}
}

function CustomTraverse(path,extentions,cb) {
	var folders = removeItemsFromArray(fs.listSync(path),".") //only get folders
	var list = fs.listSync(path,extentions) //root folders
	folders.forEach(function(item,index){
		var search = fs.listSync(item,extentions)
		search.forEach(function(item,index){
			list.push(item)
		})
		if (index == folders.length -1)
			return cb(list)
	})
}

function removeItemsFromArray(arr,search) {
	for(var i = arr.length-1; i >= 0; i--){
	    if(arr[i].indexOf(search) > -1){ 
	        arr.splice(i,1);
	    }
	}
	return arr;
}

function generateManifestString(){
	return " -m " + path.resolve(__dirname, 'incoming/manifest.xml')
}

function generateTargetDeviceNameString(){
	return " -d "+Settings.defaultDevice
}
 
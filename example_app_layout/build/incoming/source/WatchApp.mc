using Toybox.Application as App;
using Toybox.WatchUi as Ui;
using Toybox.Math as Math;
using Toybox.Communications as Comm;
using Toybox.Timer as Timer;

class WatchApp extends App.AppBase {
	hidden var view;
	hidden var app;
	var connected = false;
	var press = 0;

    //! onStart() is called on application start up
    function onStart() {
	 	var app = App.getApp();
    }

    //! onStop() is called when your application is exiting
    function onStop() {
    }
    
    function isConnected(){
    	var app = App.getApp();
    	var set = System.getDeviceSettings();
	setConnected(set.phoneConnected);
    	return app.connected;
    }
    
    function setConnected(state){
    	var app = App.getApp();
    	app.connected = state;
    }    
    
    //! Return the initial view of your application here
    function getInitialView() { 
    	app = new WatchApp();
    	view = new WatchView();
        return [ view , new InputDelegate()];
    }
    
    function getView() {
    	return view;
    }    
    
    function pushWatch(press){
    	var app = App.getApp(press);
    	Ui.switchToView(new WatchView(),new InputDelegate(press), Ui.SLIDE_LEFT);
    }
	
    function genRandomByte() {
    	return Math.rand();
    }

}

 class InputDelegate extends Ui.InputDelegate  { 
 	var press = 0;
	var app = App.getApp();
	function initialize(p){
		press = p;
	}
	 //! Key event
	 //! @param evt KEY_XXX enum value 
	 //! @return true if handled, false otherwise
	 function onKey(key) {
	 	if (key.getKey() == Ui.KEY_ENTER) { 
	 		if ( app.isConnected()) {
	 	
		 		press = press + 1;
		 		app.press = press;
		 		if (press == 3) {		
					//Do Something			
				}
				if (press == 4) {	
					//Do Something	
				}
				if (press == 5 || press == 6) {
					//! come back to watch
					app.pushWatch(press);
					press = 0;
					app.press = press;
				}
			} else {
				System.println("Not connected");
			}
	 	}
	 }
 }
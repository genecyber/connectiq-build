using Toybox.WatchUi as Ui;
using Toybox.Graphics as Gfx;
using Toybox.Time.Gregorian as Calendar;
using Toybox.System as Sys;
using Toybox.Lang as Lang;
using Toybox.Time as Time;
using Toybox.Activity as Activity;
using Toybox.ActivityMonitor as Monitor;
using Toybox.Timer as Timer;
using Toybox.Communications as Comm;

class WatchView extends Ui.View {
    var x;
    var y;
    var timer;
    
    //! Constructor
    function initialize() {}	
	
    //! Load your resources here
    function onLayout(dc) {
	    if( timer == null ) {
            timer = new Timer.Timer();
        }
        System.println("Loaded");
    }

    //! Restore the state of the app and prepare the view to be shown
    function onShow() {
    }

    //! Update the view
    function onUpdate(dc) {
    }
}
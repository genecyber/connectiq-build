using Toybox.WatchUi as Ui;
using Toybox.Graphics as Gfx;

class PedometerView extends Ui.Drawable {

    hidden var mDeviceId;

    function initialize() {
        // This is really a work around. Right now you can't get the
        // device ID from the API but you can leverage the resource
        // system to get the device you're running on.
        mDeviceId = Ui.loadResource(Rez.Strings.device);
    }

    function draw(dc) {
        // Here we'll draw the pedometer view differently based on
        // the device we're running on.
        if (mDeviceId.equals("fenix3")) {
            // Right now we're just drawing the text of the device. This
            // isn't terribly interesting but you can replace this code
            // with your own code to draw an arc/image/text/etc to end
            // up with the final view you want.
            dc.setColor(Gfx.COLOR_BLUE, Gfx.COLOR_TRANSPARENT);
            dc.drawText(160, 160, Gfx.FONT_TINY, "200", Gfx.TEXT_JUSTIFY_LEFT);
        } else {
            dc.setColor(Gfx.COLOR_BLUE, Gfx.COLOR_TRANSPARENT);
            dc.drawText(180, 120, Gfx.FONT_TINY, "200", Gfx.TEXT_JUSTIFY_CENTER);
        }
    }

}

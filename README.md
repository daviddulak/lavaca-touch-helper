Lavaca Touch Helpers
=========================

Touch Tracking Widgets for Lavaca.
View the demo [http://daviddulak.github.io/lavaca-touch-helper](http://daviddulak.github.io/lavaca-touch-helper)

##Use
Add `src/TouchTrackerWidget.js` to your Lavaca project and use it as a building block.

or

Add `src/DrawerWidget.js` and `src/TouchTrackerWidget.js` to your project for a handy drawer navigation.

        var DrawerWidget = require('app/ui/widgets/DrawerWidget');

        this.mapWidget({
          '#has-drawer-widget': DrawerWidget
        });

        this.widgets.get('has-drawer-widget').toggle();
        
        this.widgets.get('has-drawer-widget').open();
        this.widgets.get('has-drawer-widget').close();

        this.widgets.get('has-drawer-widget').disable();
        this.widgets.get('has-drawer-widget').enable();

By default the Drawer is a left drawer, but it is simple to customize

        this.widgets.get('has-drawer-widget').init('right');
        this.widgets.get('has-drawer-widget').init('top');
        this.widgets.get('has-drawer-widget').init('bottom');
        this.widgets.get('has-drawer-widget').init({
          axisTracking: 'y',
          startDirection: -1,
          moveDistance: this.screenHeight - this.restrictDragArea,
          dragAreaLimit: this.screenHeight
        });

##Run Demo
The demo requires node and grunt

        npm install -g grunt-cli (if necessary)
        npm install
        grunt server

The demo will be running on `localhost:8080`
##Tests
[TODO]


/**
 * Created by sdiemert on 2016-08-19.
 */

/**
 * Relies on SNAP SVG library to render the SVG views.
 *
 * Assumes there is an #svg element within the controller's
 * HTML scope that can have SVG appended to.
 *
 * @param $scope
 * @param $rootScope
 */
function svgController($scope, $rootScope, $state){

    /**
     * Initialize the SVG view with required data.
     */
    $scope.init = function(){

        $scope.timelineFactory = new SVGTimelineFactory("svg", 50, 100, 700, 12, 72);

        var events = [];
        events.push(new Event(10.50, "100 mg"));
        events.push(new Event(70.25, "10 mg"));
        events.push(new Event(24.50, "1000 mg"));
        events.push(new Event(30.40, "10 mg"));

        var timeline = new Timeline(72, events);

        $scope.timelineFactory.renderTimeline(timeline);

    };



    // Call the init function to kick things off.
    $scope.init();

}

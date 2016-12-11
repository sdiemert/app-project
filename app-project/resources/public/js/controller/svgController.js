"use strict";
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
function svgController($scope, $rootScope, $state, apiService){

    /**
     * Initialize the SVG view with required data.
     */
    $scope.init = function(){

        $scope.timelineFactory = new SVGTimelineFactory("svg", 50, 100, 700, 12, 72);

        var events = [];
        events.push(new Event(12, "10 mg"));
        events.push(new Event(36, "10 mg"));

        $scope.timeline = new SliderTimeline(72, events);

        $scope.timelineFactory.renderTimeline($scope.timeline);

        $(window).on("resize", function(){
            $scope.timelineFactory.renderTimeline($scope.timeline);
        });

    };

    /**
     * To be called when the "done" button is selected.
     * @param cb {function} to be called once the task is done,
     *  if null or undefined the default behavior is to send the response to
     *  the server for recording.
     */
    $scope.doneTask = function(cb){

        console.log("doneTask", cb);

        if(cb) cb($scope.timeline);
        else{

        }

    };

    $scope.next = function(goTo){
        $state.go(goTo);
    };


    // Call the init function to kick things off.
    $scope.init();

}

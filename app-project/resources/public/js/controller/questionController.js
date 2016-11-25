function questionController ($scope, $rootScope, $state, apiService){

    var params = $state.params;

    $scope.questionNumber = params['questionNum'];

    $scope.init = function(){

        // Fetch question from the server.

        apiService.getTimeline($rootScope.key, $scope.questionNumber,

            function(timeline){

                if(!timeline){
                    $state.go("end");
                }else{

                    $scope.timeline = timeline;

                    // Use the SVG factory to render the timeline to the screen.
                    var fact = new SVGTimelineFactory("svg", 50, 100, 700, timeline.interval, timeline.hours);
                    //fact.renderTimeline($scope.timeline);

                    $(window).on("resize", function(){
                        fact.renderTimeline($scope.timeline);
                    });
                    
                    //$("timeline-wrapper").hide();

                    $("#timeline-wrapper").fadeIn();

                    $(window).trigger("resize");
    
                }

        });

    };

    $scope.doneQuestion = function(){

        // submit the response to the server.

        apiService.sendResponse($scope.questionNumber, $scope.timeline, $rootScope.key, function(d){
                $("#timeline-wrapper").fadeOut(function(){
                    if(d.next){
                        $state.go("question", {questionNum : d.next})
                    }else{
                        $state.go("doneTimelines");
                    }
                });
            }
        );

    };

    $scope.init();

}
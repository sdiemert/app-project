function questionController ($scope, $rootScope, $state, apiService){

    var params = $state.params;

    $scope.questionNumber = params['questionNum'];

    $scope.init = function(){

        // Fetch question from the server.

        apiService.getTimeline($scope.questionNumber, function(timeline){

            $scope.timeline = timeline;

            // Use the SVG factory to render the timeline to the screen.
            var fact = new SVGTimelineFactory("svg", 50, 100, 700, 12, timeline.hours);
            fact.renderTimeline($scope.timeline);

        });

    };

    $scope.doneQuestion = function(){

        // submit the response to the server.

        apiService.sendResponse($scope.questionNumber, $scope.timeline, 
            $rootScope.username, $rootScope.password, 
            function(d){

                if(d.next){
                    $state.go("question", {questionNum : d.next})
                }else{
                    // TODO: Make new "end" state page.
                    $state.go("end")
                }
            }
        );

        // get the next question number.

        // advance to the next question.

    };

    $scope.init();

}
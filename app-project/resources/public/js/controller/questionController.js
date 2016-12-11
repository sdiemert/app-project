"use strict";
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

                    if($scope.questionNumber == 9 || $scope.questionNumber == 10){

                        var s = timeline.rx;
                        // Take Hydromorphone Contin 9 mg orally twice daily and take Hydromorphone 4 mg orally every 4 hours as needed

                        var s0 = timeline.rx.substring(0,50);
                        var s1 = timeline.rx.substring(54);

                        $("#rx-span").css("font-weight", "normal");

                        if($scope.questionNumber == 9){
                            var h = "<span style='font-weight:bold'>"+s0+"</span>"+" "+s1;
                            $("#rx-span").html(h)
                        }else{
                            var h = s0+" <span style='font-weight:bold'>"+s1+"</span>";

                            $("#rx-span").html(h)
                        }

                    }else{
                        $("#rx-span").css("font-weight", "bold").html(timeline.rx);
                    }
    
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
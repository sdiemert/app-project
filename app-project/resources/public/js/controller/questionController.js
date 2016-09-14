function questionController ($scope, $rootScope, $state, apiService){

    var params = $state.params;

    console.log("In questionController", "params", params);

    var questionNumber = params['questionNumber'];

    $scope.init = function(){

        // Fetch question from the server.

        // Load the question data from the server into a timeline object.

        // Use the SVG factory to render the timeline to the screen.

        // Capture response on "Done" button click

    }

}
angular.module('avBooth')
  .directive('avBooth', function($resource, $location) {

    // we use it as something similar to a controller here
    function link(scope, element, attrs) {

      // possible values of the election state scope variable
      var stateEnum = {
        receivingElection: 'receivingElection',
        errorScreen: 'errorScreen',
        startScreen: 'startScreen',
        multiQuestion: 'multiQuestion'
      };

      // override state if in debug mode and it's provided via query param
      function setState(newState, newStateData) {
        if (!scope.config.debug || $location.search()['state'] == null) {
          console.log("setting state to " + newState);
          scope.state = newState;
          scope.stateData = newStateData;
          scope.stateChange++;
        } else {
          console.log("state override: not setting state to " + newState);
          scope.state = $location.search()['state'];
        }
      }

      // given a question number, looks at the question type and tells the
      // correct state to set, so that the associated directive correctly shows
      // the given question
      function nextQuestionState(questionNum) {
        var question = scope.election.questions[questionNum];
        var map = {
          "MEEK-STV": stateEnum.multiQuestion
        };
        return map[question.tally_type];
      }

      // changes state to the next one, calculating it and setting some scope
      // vars
      function next() {
        var questionStates = [stateEnum.multiQuestion];
        if (scope.state === stateEnum.startScreen)
        {
          scope.setState(nextQuestionState(0), {
            question: scope.election.questions[0],
            questionNum: 0,
            isLastQuestion: (scope.election.questions.length === 1),
            filter: ""
          });

        } else if (scope.stateData.isLastQuestion)
        {
          showError("review screen still not implemented");

        } else if (_.contains(questionStates, scope.state) &&
                   !scope.stateData.isLastQuestion)
        {
          var n = scope.stateData.questionNum + 1;
          scope.setState(nextQuestionState(n), {
            questionNum: scope.stateData.questionNum + 1,
            question: scope.election.questions[n],
            isLastQuestion: scope.election.questions.length === n + 1,
            filter: ""
          });
        }
      }

      // shows the error string
      function showError(error) {
        scope.setState(stateEnum.errorScreen, {error: error});
      }

      // init scope vars
      angular.extend(scope, {
        election: null,
        setState: setState,
        stateEnum: stateEnum,
        stateChange: 0,
        showError: showError,
        next: next,

        // stateData stores information used by the directive being shown.
        // Its content depends on the current state.
        stateData: {},

        // contains the clear text of the ballot. It's a list with an element
        // per question.
        // The format of each item in the array depends on the voting method for
        // the related question. This is used by the directives to store the
        // clear text of the ballot.
        ballotClearText: [],

        // convert config to JSON
        config: angular.fromJson(scope.configStr)
      });
      setState(stateEnum.receivingElection);

      // load election on background
      try {
        $resource(scope.electionUrl, {}, {'get': {method: 'GET'}})
          .get()
          .$promise
          // on success
          .then(function(value) {
            scope.election = value;
            // initialize ballotClearText as a list of lists
            scope.ballotClearText = _.map(
              scope.election.question, function () { return []; });
            scope.setState(stateEnum.startScreen, {});
          },
          // on error, like parse error or 404
          function (error) {
            showError("error loading the election");
          });

      // the electionUrl might throw an exception
      } catch (error) {
          showError("error loading the election");
      }
    }


    return {
      restrict: 'E',
      scope: {
        electionUrl: '@electionUrl',
        configStr: '@config'
      },
      link: link,
      templateUrl: 'avBooth/booth-directive/booth-directive.html'
    };
  });

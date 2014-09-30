angular.module('avBooth')
  .directive('avBooth', function($resource, $location) {

    // we use it as something similar to a controller here
    function link(scope, element, attrs) {

      // possible values of the election state scope variable
      var stateEnum = {
        receivingElection: 'receivingElection',
        errorScreen: 'errorScreen',
        helpScreen: 'helpScreen',
        startScreen: 'startScreen',
        multiQuestion: 'multiQuestion',
        reviewScreen: 'reviewScreen',
        castingBallotScreen: 'castingBallotScreen'
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
      function goToQuestion(n, reviewMode) {
        var question = scope.election.questions[n];
        var map = {
          "MEEK-STV": stateEnum.multiQuestion,
          "APPROVAL": stateEnum.multiQuestion
        };
        var nextState = map[question.tally_type];

        scope.setState(nextState, {
          question: scope.election.questions[n],
          questionNum: n,
          isLastQuestion: (scope.election.questions.length === n + 1),
          reviewMode: reviewMode,
          filter: ""
        });
      }

      // changes state to the next one, calculating it and setting some scope
      // vars
      function next() {
        var questionStates = [stateEnum.multiQuestion];
        if (scope.state === stateEnum.startScreen)
        {
          goToQuestion(0, false);

        } else if (scope.state === stateEnum.reviewScreen)
        {
          scope.setState(stateEnum.castingBallotScreen, {});

        } else if (scope.stateData.isLastQuestion || scope.stateData.reviewMode)
        {
          scope.setState(stateEnum.reviewScreen, {});

        } else if (_.contains(questionStates, scope.state) &&
                   !scope.stateData.isLastQuestion)
        {
          goToQuestion(scope.stateData.questionNum + 1, false);
        }
      }

      // shows the error string
      function showError(error) {
        scope.setState(stateEnum.errorScreen, {error: error});
      }

      function launchHelp() {
        scope.setState(stateEnum.helpScreen, {
          oldState: {
            name: scope.state,
            data: angular.copy(scope.stateData)
          }});
      }

      function backFromHelp() {
        if (scope.state !== stateEnum.helpScreen) {
          console.log("error, calling to backFromHelp in another state");
          return;
        }

        scope.setState(
          scope.stateData.oldState.name,
          scope.stateData.oldState.data);
      }

      // init scope vars
      angular.extend(scope, {
        election: null,
        setState: setState,
        stateEnum: stateEnum,
        stateChange: 0,
        showError: showError,
        launchHelp: launchHelp,
        backFromHelp: backFromHelp,
        goToQuestion: goToQuestion,
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

      // execute pre-check first
      if (attrs.preCheck) {
        var ret = scope.preCheck();
        if (ret !== null) {
          showError(ret);
          return;
        }
      }


      setState(stateEnum.receivingElection, {});

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
              scope.election.questions, function () { return []; });
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
        configStr: '@config',

        // optional function to be called before anything, that will return null
        // if there's no error, or the error to be shown if there was some
        preCheck: '&'
      },
      link: link,
      templateUrl: 'avBooth/booth-directive/booth-directive.html'
    };
  });

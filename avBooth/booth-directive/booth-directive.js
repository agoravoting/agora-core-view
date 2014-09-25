angular.module('avBooth')
  .directive('avBooth', function($resource, $location) {

    // we use it as something similar to a controller here
    function link(scope, element, attrs) {

      // possible values of the election status scope variable
      var statusEnum = {
        receivingElection: 'receivingElection',
        errorLoadingElection: 'errorLoadingElection',
        startScreen: 'startScreen',
        multiQuestion: 'multiQuestion',
      };

      // override status if in debug mode and it's provided via query param
      function setStatus(newStatus) {
        if (!scope.config.debug || $location.search()['status'] == null) {
          console.log("setting status to " + newStatus);
          scope.status = newStatus;
        } else {
          console.log("status override: not setting status to " + newStatus);
          scope.status = $location.search()['status'];
        }
      }

      // given a question number, looks at the question type and tells the
      // correct status to set, so that the associated directive correctly shows
      // the given question
      function nextQuestionStatus(questionNum) {
        var question = scope.election.questions[questionNum];
        var map = {
          "MEEK-STV": "multiQuestion"
        };
        return map[question.tally_type];
      }

      // changes status to the next one, calculating it and setting some scope
      // vars
      function next() {
        var questionStates = ["multiQuestion"];
        if (scope.status === 'startScreen')
        {
          scope.statusData.question = scope.election.questions[0];
          scope.statusData.questionNum = 0;
          scope.statusData.isLastQuestion = (scope.election.questions.length === 1);
          scope.status = nextQuestionStatus(0);

        } else if (scope.statusData.isLastQuestion)
        {
          // TODO: go to review step
          console.log("TODO: go to review");

        } else if (_.contains(questionStates, scope.status) &&
                   !scope.statusData.isLastQuestion)
        {
          scope.statusData.questionNum++;
          var n = scope.statusData.questionNum;
          scope.statusData.question = scope.election.questions[n];
          scope.statusData.isLastQuestion = (scope.election.questions.length === n + 1);
          scope.status = nextQuestionStatus(n);
        }
      }

      // init scope vars
      angular.extend(scope, {
        election: null,
        setStatus: setStatus,
        statusEnum: statusEnum,
        next: next,

        // statusData stores information used by the directive being shown.
        // Its content depends on the current status.
        statusData: {},

        // contains the clear text of the ballot. It's a list with an element
        // per question.
        // The format of each item in the array depends on the voting method for
        // the related question. This is used by the directives to store the
        // clear text of the ballot.
        ballotClearText: [],

        // convert config to JSON
        config: angular.fromJson(scope.configStr)
      });
      setStatus(statusEnum.receivingElection);

      // load election on background
      try {
        $resource(scope.electionUrl, {}, {'get': {method: 'GET'}})
          .get()
          .$promise
          // on success
          .then(function(value) {
            scope.election = value;
            scope.setStatus(statusEnum.startScreen);
          },
          // on error, like parse error or 404
          function (error) {
            scope.setStatus(statusEnum.errorLoadingElection);
          });

      // the electionUrl might throw an exception
      } catch (error) {
          scope.setStatus(statusEnum.errorLoadingElection);
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
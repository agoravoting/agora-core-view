angular.module('avBooth')
  .directive('avBooth', function($http, $location, $i18next, $window, $timeout, HmacService) {

    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
      // timeout is used with updateWidth so that we do not create too many
      // calls to it, at most one per 100ms
      var timeoutWidth;
      var w = angular.element($window);

      function updateWidth() {
        timeoutWidth = $timeout(function() {
          $timeout.cancel(timeoutWidth);
          scope.windowWidth = w.width();
          console.log("scope.windowWidth = " + scope.windowWidth);
          scope.$apply();
        }, 100);
      }
      w.bind('resize', function () {
        updateWidth();
      });
      updateWidth();

      // possible values of the election state scope variable
      var stateEnum = {
        receivingElection: 'receivingElection',
        errorScreen: 'errorScreen',
        helpScreen: 'helpScreen',
        startScreen: 'startScreen',
        multiQuestion: 'multiQuestion',
        draftsElectionScreen: 'draftsElectionScreen',
        auditBallotScreen: 'auditBallotScreen',
        pcandidatesElectionScreen: 'pcandidatesElectionScreen',
        encryptingBallotScreen: 'encryptingBallotScreen',
        castOrCancelScreen: 'castOrCancelScreen',
        reviewScreen: 'reviewScreen',
        castingBallotScreen: 'castingBallotScreen',
        successScreen: 'successScreen'
      };

      // override state if in debug mode and it's provided via query param
      function setState(newState, newStateData) {
        console.log("setting state to " + newState);
        scope.state = newState;
        scope.stateData = newStateData;
        scope.stateChange++;
      }

      // given a question number, looks at the question type and tells the
      // correct state to set, so that the associated directive correctly shows
      // the given question
      function goToQuestion(n, reviewMode) {
        // first check for special election-wide layouts
        var layout = scope.election.layout;
        if (layout !== "normal") {
          if (layout === "drafts-election") {
            scope.setState(stateEnum.draftsElectionScreen, {
              isLastQuestion: true,
              reviewMode: true,
              filter: ""
            });
            return;
          } else if (layout === "pcandidates-election") {
            scope.setState(stateEnum.pcandidatesElectionScreen, {
              isLastQuestion: true,
              reviewMode: true,
              filter: ""
            });
            return;
          }
        }

        var question = scope.election.questions_data[n];
        var map = {
          "MEEK-STV": stateEnum.multiQuestion,
          "APPROVAL": stateEnum.multiQuestion
        };
        var nextState = map[question.tally_type];

        scope.setState(nextState, {
          question: scope.election.questions_data[n],
          questionNum: n,
          isLastQuestion: (scope.election.questions_data.length === n + 1),
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
          if (!scope.stateData.auditClicked) {
            scope.setState(stateEnum.castingBallotScreen, {
              encryptedBallot: scope.stateData.encryptedBallot,
              auditableBallot: scope.stateData.auditableBallot
            });
          } else {
            scope.setState(stateEnum.auditBallotScreen, {
              encryptedBallot: scope.stateData.encryptedBallot,
              auditableBallot: scope.stateData.auditableBallot,
              ballotHash: scope.stateData.auditableBallot.ballot_hash
            });
          }

        } else if (scope.state === stateEnum.auditBallotScreen)
        {
          goToQuestion(0, false);

        } else if (scope.state === stateEnum.encryptingBallotScreen)
        {
          scope.setState(stateEnum.reviewScreen, {
            encryptedBallot: scope.stateData.encryptedBallot,
            auditableBallot: scope.stateData.auditableBallot,
            ballotHash: scope.stateData.auditableBallot.ballot_hash,
            auditClicked: false
          });

        } else if (scope.state === stateEnum.castingBallotScreen)
        {
          scope.setState(stateEnum.successScreen, {
            ballotHash: scope.stateData.ballotHash
          });

        } else if (scope.stateData.isLastQuestion || scope.stateData.reviewMode)
        {
          scope.setState(stateEnum.encryptingBallotScreen, {});

        } else if (_.contains(questionStates, scope.state) &&
                   !scope.stateData.isLastQuestion)
        {
          goToQuestion(scope.stateData.questionNum + 1, false);
        }
      }

      // shows the error string
      function showError(error) {
        if (scope.state === stateEnum.errorScreen) {
          console.log("already in an error state, new error appeared: " + error);
          return;
        }
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

      function retrieveElectionConfig() {
        try {
          $http.get(scope.baseUrl + "election/" + scope.electionId + "/config")
            // on success
            .success(function(value) {
              scope.election = value;
              // initialize ballotClearText as a list of lists
              scope.ballotClearText = _.map(
                scope.election.questions_data, function () { return []; });
              scope.setState(stateEnum.startScreen, {});
            })
            // on error, like parse error or 404
            .error(function (error) {
              showError($i18next("avBooth.errorLoadingElection"));
            });

          $http.get(scope.baseUrl + "election/" + scope.electionId + "/pubkeys")
            // on success
            .success(function(value) {
              scope.pubkeys = value;
            })
            // on error, like parse error or 404
            .error(function (error) {
              // TODO: in order to remove race condition with the other showError
              // errorLoadingElection, we comment this for now
              // showError($i18next("avBooth.errorLoadingElectionPubKeys"));
            });
        } catch (error) {
          showError($i18next("avBooth.errorLoadingElection"));
        }
      }
      function avPostAuthorization(e) {
        var action = "avPostAuthorization:";
        if (e.data.substr(0, action.length) !== action) {
          return;
        }

        var khmacStr = e.data.substr(action.length, e.data.length);
        var khmac = HmacService.checkKhmac(khmacStr);
        if (!khmac) {
          showError($i18next("avBooth.errorLoadingElection"));
          return;
        }
        scope.authorizationHeader = khmac.message + ":" + khmac.digest;
        var splitMessage = khmac.message.split(":");

        if (splitMessage.length < 2) {
          showError($i18next("avBooth.errorLoadingElection"));
          return;
        }
        scope.voterId = splitMessage[0].split("-")[2];
        scope.authorizationReceiver();
        scope.authorizationReceiver = null;
      }
      scope.setAuthorizationReceiver = function (callback) {
        scope.authorizationReceiver = callback;
      };

      // load election on background
      if (scope.authorizationHeader.length < 70) {
        // we need to request our authorization to the parent window using
        // web messaging
        $window.addEventListener('message', avPostAuthorization, false);

        scope.setAuthorizationReceiver(retrieveElectionConfig);
        $window.top.postMessage(
          "avRequestAuthorization:" +
          angular.toJson({
            permission: "vote",
            object_type: "election",
            object_id: scope.electionId
          }), '*');
      } else {
        retrieveElectionConfig();
      }
    }


    return {
      restrict: 'AE',
      scope: {
        baseUrl: '@',
        voterId: '@',
        electionId: '@',
        authorizationHeader: '@',
        configStr: '@config',

        // optional function to be called before anything, that will return null
        // if there's no error, or the error to be shown if there was some
        preCheck: '&',
      },
      link: link,
      templateUrl: 'avBooth/booth-directive/booth-directive.html'
    };
  });

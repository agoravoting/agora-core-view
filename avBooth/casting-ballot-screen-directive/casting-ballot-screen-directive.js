/*
 * Casting Ballot Screen directive.
 *
 * Shown while the ballot is being encrypted and sent.
 */
angular.module('avBooth')
  .directive('avbCastingBallotScreen', function($i18next, CastBallotService, EncryptBallotService, $timeout, $window, InsideIframeService) {

    function link(scope, element, attrs) {
      // moves the title on top of the busy indicator
      scope.updateTitle = function(title) {
        var titleEl = element.find(".avb-busy-title").html(title);

        // set margin-top
        var marginTop = - titleEl.height() - 45;
        var marginLeft = - titleEl.width()/2;
        titleEl.attr("style", "margin-top: " + marginTop + "px; margin-left: " + marginLeft + "px");
      };

      // function that receives updates from the cast ballot service and shows
      // them to the user
      function statusUpdateFunc(status, options) {
        if (status === "sanityChecks") {
          scope.updateTitle($i18next(
            "avBooth.statusExecutingSanityChecks",
            {
              percentage: options.percentageCompleted
            }));
          scope.percentCompleted = options.percentageCompleted;

        } else if (status === "encryptingQuestion") {
          scope.updateTitle($i18next(
            "avBooth.statusEncryptingQuestion",
            {
              questionNum: options.questionNum + 1,
              percentage: options.percentageCompleted
            }));
          scope.percentCompleted = options.percentageCompleted;

        } else if (status === "verifyingQuestion") {
          scope.updateTitle($i18next(
            "avBooth.statusVerifyingQuestion",
            {
              questionNum: options.questionNum + 1,
              percentage: options.percentageCompleted
            }));
          scope.percentCompleted = options.percentageCompleted;

        } else if (status === "sendingBallot") {
          scope.updateTitle($i18next(
            "avBooth.sendingBallot",
            {percentage: options.percentageCompleted}));
          scope.stateData.ballotHash = options.ballotHash;
          scope.percentCompleted = options.percentageCompleted;
        }
      }
      // delay in millisecs
      var delay = 500;

      function encryptBallot() {
        var encryptionInfo = {
          election: scope.election,
          pubkeys: scope.pubkeys,
          statusUpdate: statusUpdateFunc,
          authorizationHeader: scope.authorizationHeader,
          castBallotUrl: scope.baseUrl + "election/" + scope.electionId + "/vote/" + scope.voterId,
          encryptedBallot: null,

          // on success, we first then try to submit, then once submitted we
          // show the next screen (which is the success-screen directive)
          success: function(encryptedBallot, auditableBallot) {
            if (encryptionInfo.encryptedBallot === null) {
              console.log(auditableBallot);
              console.log(encryptedBallot);
              scope.updateTitle($i18next("avBooth.sendingBallot", {percentage: 80}));
              scope.percentCompleted = 80;
              encryptionInfo.encryptedBallot = encryptedBallot;
              CastBallotService(encryptionInfo);
              return;
            }

            scope.updateTitle($i18next("avBooth.sendingBallot", {percentage: 100}));
            scope.percentCompleted = 100;
            scope.next();
          },

          // on error, try to deal with it
          error: function (status, message) {
            if (status === "couldntSendBallot") {
              // TODO show "try again" button somehow if it's a network problem.
              // hopefully, without having to encrypt again the ballot
              scope.showError($i18next("avBooth.errorSendingBallot",
                {msg:message}));
            } else if (status === "couldntSendBallotNotFound") {
              scope.showError($i18next("avBooth.couldntSendBallotNotFound",
                {msg:message}));
            } else if (status === "couldntSendBallotUnauthorized") {
              scope.showError($i18next("avBooth.couldntSendBallotUnauthorized",
                {msg:message}));
            } else if (status === "errorEncrypting") {
              scope.showError($i18next("avBooth.errorEncrypting",
                {msg:message}));
            } else if (status === "errorEncoding") {
              scope.showError($i18next("avBooth.errorEncoding",
                {msg:message}));
            } else if (status === "sanityChecksFailed") {
              scope.showError($i18next("avBooth.sanityChecksFailed",
                {msg:message}));
            } else if (status === "tooManyUserUpdates") {
              scope.showError($i18next("avBooth.tooManyUserUpdates",
                {msg:message}));
            } else {
              scope.showError($i18next("avBooth.errorSendingBallotUnknown",
                {msg:message}));
            }
          },
          verify: false,
          delay: delay
        };
        EncryptBallotService(encryptionInfo);
      }

      $timeout(function () {
        if (InsideIframeService()) {
        scope.setAuthorizationReceiver(encryptBallot);
        $window.top.postMessage(
          "avRequestAuthorization:" +
          angular.toJson({
            permission: "vote",
            object_type: "election",
            object_id: scope.electionId
          }), '*');
        } else {
          encryptBallot();
        }
      }, delay);
    }

    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'avBooth/casting-ballot-screen-directive/casting-ballot-screen-directive.html'
    };
  });
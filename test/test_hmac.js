/*
 * TestHmacController, that allows you to test that you are correctly
 * generating the urls for elections.
 */
angular.module('avTest')
  .controller('TestHmacController',
    function($scope, $stateParams, HmacService, amMoment) {
      $scope.hmac = $stateParams.hmac;
      $scope.message = $stateParams.message;
      $scope.key = $stateParams.key;
      $scope.calculatedHmac = HmacService.hmac($stateParams.key,
                                               $stateParams.message);
      $scope.hmacIsValid = HmacService.checkHmac($stateParams.key,
                                                $stateParams.message,
                                                $stateParams.hmac);

      // decompose message if possible
      var voterId = "<unset>";
      var electionId = "<unset>";
      var timestamp = "<unset>";
      var messageInvalid = "";
      var messageTimestamp = $stateParams.message.split(":");
      var message = "<unset>";
      var splitMessage = "<unset>";
      var hasError = false;
      console.log("TestHmacController");

      if (messageTimestamp.length !== 2 ) {
        messageInvalid = "(Invalid message, it should follow this format: voter-<electionId>-<voterId>:<timestamp>) 1";
        hasError = true;
      } else {
        message = messageTimestamp[0];
        timestamp = "" + parseInt(messageTimestamp[1]);
        splitMessage = message.split("-");
      }

      if (!hasError && (splitMessage.length !== 3 || splitMessage[0] !== "voter")) {
        hasError = true;
        messageInvalid = "(Invalid message, it should follow this format: voter-<electionId>-<voterId>:<timestamp>) 2";
      } else {
        electionId = "" + parseInt(splitMessage[1]);
        voterId = splitMessage[2];
      }
      $scope.voterId = voterId;
      $scope.electionId = electionId;
      $scope.timestamp = timestamp;
      $scope.timeago = moment(timestamp, "X").fromNow();
      $scope.messageInvalid = messageInvalid;
  });

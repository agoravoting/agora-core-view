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
      var splitMessage = $stateParams.message.split(":");

      if (splitMessage.length !== 3) {
          messageInvalid = "(Invalid message, it should follow this format: voterId:electionId:timestamp)";
      } else {
        voterId = splitMessage[0];
        electionId = "" + parseInt(splitMessage[1]);
        timestamp = "" + parseInt(splitMessage[2]);
      }
      $scope.voterId = voterId;
      $scope.electionId = electionId;
      $scope.timestamp = timestamp;
      $scope.timeago = moment(timestamp, "X").fromNow();
      $scope.messageInvalid = messageInvalid;
  });

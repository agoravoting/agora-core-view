/*
  Encrypts an election ballot and sends it to the server.

  While it does that, it send status updates via a callback function. It also
  provides success and error callbacks.

  This service is a function that receives an object

  The statusUpdate callback receives two arguments, status and options:
   - when status is "encryptingQuestion", options is an object with
     "questionNum" and "percentageCompleted" attributes, both integers. The
     statusUpdate callback is called with this status before it starts
     encrypting the answers to a question.

   - when status is "verifyingQuestion", options is an object with
     "questionNum" and "percentageCompleted" attributes, both integers. The
     statusUpdate callback is called with this status after having encrypted the
     answers to a question and beofre it starts verifying that encrypted data.

   - when status is "sendingBallot", options is an object with
     "percentageCompleted", "ballotHash" and "ballotData" attributes. The
     statusUpdate callback is called with this status before it starts sending
     the ballot to the server.

  The success callback receives the json result data from the server.
  The error callback receives a status and a more detailed message.
  The verify attribute specifies if the service should verify the proof it
  generates. This takes more time, but gives extra security.

  If the input data does not validate, it might throw an exception string.

  Usage:

      CastBallotService({
        election: election,
        statusUpdate: function () (status, options) { .. },
        success: function (resultData) { },
        error: function (status, message) {},
        verify: true
      );
*/

angular.module('avCrypto')
  .service('CastBallotService', function(ConfigService, EncryptAnswerService, moment, SjclService) {
    function hashObject(obj) {
      var objStr = angular.toJson(obj);
      var hashBits = SjclService.hash.sha256.hash(objStr);
      return SjclService.codec.hex.fromBits(hashBits);
    }

    function getPlainText(question) {
      // TODO as a new AnswersEncoderService service
      return 101;
    }

    return function (data) {
      // minimally check input
      if (!angular.isObject(data)) {
        throw "invalid input data, not an object";
      }
      if (!angular.isDefined(data.error) || !angular.isFunction(data.error)) {
        throw "data.error is not a function";
      }
      if (!angular.isDefined(data.success) || !angular.isFunction(data.success)) {
        data.error("invalidDataFormat", "data.success is not a function");
      }
      if (!angular.isDefined(data.statusUpdate) || !angular.isFunction(data.statusUpdate)) {
        data.error("invalidDataFormat", "data.statusUpdate is not a function");
      }
      if (!angular.isDefined(data.election) || !angular.isObject(data.election)) {
        data.error("invalidDataFormat", "invalid data.election, not an object");
      }
      if (!angular.isDefined(data.verify)) {
        data.error("invalidDataFormat", "invalid data.verify");
      }
      // convert to bool for sure
      data.verify = !!data.verify;

      var numQuestions = data.election.questions;
      var qNum = 0;
      var answers = [];

      // used to calculate the percentage. If data.verify is true, each
      // iteration has two steps
      var iterationSteps = 1;
      if (data.verify) {
        iterationSteps = 2;
      }

      // for each question answers, do encrypt
      for (var i = 0; i < numQuestions; i++) {

        // initialization
        var question = data.election.questions[i];
        var percent = Math.floor(
          (100*i*iterationSteps) / (numQuestions*iterationSteps + 1));

        // hey, let's say to the user we have done something already, 5%
        // minimum right?
        if (percent < 5) {
          percent = 5;
        }

        data.statusUpdate(
          "encryptingQuestion",
          {
            questionNum: i,
            percentageCompleted: percent
          }
        );

        // do the encryption. This takes time!
        var pk = EncryptAnswerService.ElGamal.PublicKey.fromJSONObject(data.election.pubkeys[i]);
        var encryptor = EncryptAnswerService.init(pk);
        var plaintext = getPlainText(question);
        answers.push(encryptor.encryptAnswer(plaintext));

        // TODO: verify the encryption
      }

      // ballot generated
      var ballot = {
        issue_date: moment().format(),
        answers: answers
      };

      // generate ballot hash
      var ballotHash = hashObject(ballot);

      // TODO send sendingBallot status, send ballot, etc
    };
  });
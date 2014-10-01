/*
  Encrypts an election ballot and sends it to the server.

  While it does that, it send status updates via a callback function. It also
  provides success and error callbacks.

  This service is a function that receives an object

  The statusUpdate callback receives two arguments, status and options:
   - when status is "sanityChecks", options is an object with the
     "percentageCompleted" attribute. The statusUpdate callback is  called with
     this status before it starts executing the sanity checks.

   - when status is "encryptingQuestion", options is an object with
     "questionNum" and "percentageCompleted" attributes, both integers. The
     statusUpdate callback is called with this status before it starts
     encrypting the answers to a question.

   - when status is "verifyingQuestion", options is an object with
     "questionNum" and "percentageCompleted" attributes, both integers. The
     statusUpdate callback is called with this status after having encrypted the
     answers to a question and beofre it starts verifying that encrypted data.

   - when status is "sendingBallot", options is an object with
     "percentageCompleted", "ballotHash" and "ballot" attributes. The
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
  .service('CastBallotService', function(ConfigService, EncryptAnswerService,
    moment, SjclService, DeterministicJsonStringifyService,
    AnswerEncoderService)
  {
    var stringify = DeterministicJsonStringifyService;

    function hashObject(obj) {
      var objStr = stringify(obj);
      var hashBits = SjclService.hash.sha256.hash(objStr);
      return SjclService.codec.hex.fromBits(hashBits);
    }

    function getPlainText(question, verify) {
      // first, convert the question answers into a list of selected options
      // get only selected
      var filtered = _.filter(question.answers, function (option) {
          return option.selected > -1;
      });

      // sort by selected
      var sorted = _.sortBy(filtered, function (option) {
        return option.selected;
      });

      // get the selected sorted options as a list of int ids
      var answers = _.pluck(sorted, "id");

      // encode the answers
      var codec = AnswerEncoderService(question.tally_type, question.answers.length);
      var encoded = codec.encode(answers);
      if (verify) {
        var decoded = codec.decode(encoded);
        if (stringify(answers) !== stringify(decoded)) {
          return null;
        }
      }
      return encoded;
    }

    function formatBallot(election, answers) {
      var ballot = {
            "a": "encrypted-vote-v1",
            "proofs": [],
            "choices": [],
            "issue_date": moment().format(),
            "election_hash": {"a": "hash/sha256/value", "value": election.hash},
        };
        for (var i = 0; i < election.questions.length; i++) {
            var qAnswer = answers[i];
            ballot.proofs.push({
                "commitment": qAnswer['commitment'],
                "response": qAnswer['response'],
                "challenge": qAnswer['challenge']
            });
            ballot.choices.push({
                "alpha": qAnswer['alpha'],
                "beta": qAnswer['beta']
            });
        }
        return ballot;
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
        return;
      }
      if (!angular.isDefined(data.statusUpdate) || !angular.isFunction(data.statusUpdate)) {
        data.error("invalidDataFormat", "data.statusUpdate is not a function");
        return;
      }
      if (!angular.isDefined(data.election) || !angular.isObject(data.election)) {
        data.error("invalidDataFormat", "invalid data.election, not an object");
        return;
      }
      if (!angular.isDefined(data.verify)) {
        data.error("invalidDataFormat", "invalid data.verify");
        return;
      }
      // convert to bool for sure
      data.verify = !!data.verify;

      var numQuestions = data.election.questions.length;
      var qNum = 0;
      var answers = [];

      // used to calculate the percentage. If data.verify is true, each
      // iteration has two steps
      var iterationSteps = 1;
      if (data.verify) {
        iterationSteps = 2;
      }

      data.statusUpdate("sanityChecks", {percentageCompleted: 0});

      // for each question, execute sanity check
      var sanitized = true;
      var i = 0;
      var question;
      var codec;
      var percent;
      try {
        for (i = 0; i < numQuestions; i++) {
          question = data.election.questions[i];
          codec = AnswerEncoderService(question.tally_type, question.answers.length);
          if (!codec.sanityCheck(data.election.questions[i])) {
            sanitized = false;
          }
        }
      } catch(e) {
        sanitized = false;
      }

      if (!sanitized) {
        data.error("sanityChecksFailed", "we have detected errors when doing some " +
          "sanity automatic checks which prevents to assure that you can " +
          "vote with this web browser. This is most likely a problem with " +
          "your web browser.");
        return;
      }


      // for each question answers, do encrypt
      for (i = 0; i < numQuestions; i++) {

        // initialization
        question = data.election.questions[i];
        percent = Math.floor(
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

        // we always verify plaintext just to be sure, because it takes very
        // little CPU time
        var plaintext = getPlainText(question, true);
        if (!plaintext) {
          data.error("errorEncoding", "error while encoding the answer to a question");
          return;
        }
        var encryptedAnswer = encryptor.encryptAnswer(plaintext);
        answers.push(encryptedAnswer);

        if (data.verify) {
          // send status update
          percent = Math.floor(
            (100*i*iterationSteps + 1) / (numQuestions*iterationSteps + 1));
          if (percent < 5) {
            percent = 5;
          }
          data.statusUpdate(
            "verifyingQuestion",
            {
              questionNum: i,
              percentageCompleted: percent
            }
          );
          if (encryptor.verifyPlaintextProof(encryptedAnswer)) {
            data.error("errorEncrypting", "error while encrypting the answer to a question");
            return;
          }
        }
      }

      // ballot generated
      var ballot = formatBallot(data.election, answers);

      // generate ballot hash
      var ballotHash = hashObject(ballot);

      data.statusUpdate(
        "sendingBallot",
        {
          ballotHash: ballotHash,
          ballot: angular.copy(ballot)
        }
      );
    };
  });
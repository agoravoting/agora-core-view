/*
 * Encodes/Decodes the answer to a question given the question type.
 *
 * The encoder function always receives answer as a list of answer ids.
 *
 * Usage:
 *   var answer = [1, 5];
 *   var codec = AnswerEncoderService("MEEK-STV", 7);
 *   asser(codec.sanityCheck()).toBe(true);
 *   var encoded = codec.encode([1, 5], );
 *   var decoded = codec.decode(encoded);
 *   assert(DeterministicJsonStringifyService(decoded) ==
 *          DeterministicJsonStringifyService(answer)).toBe(true);
 */

angular.module('avCrypto')
  .service('AnswerEncoderService', function(DeterministicJsonStringifyService, BigIntService) {
    var stringify = DeterministicJsonStringifyService;


    /**
     * Converts a number to a string. For example if number=23 and numCharts=3,
     * result="023"
     */
    function numberToString(number, numChars) {
        var numStr = number.toString(10);
        var ret = numStr;
        for (var i = 0; i < numChars - numStr.length; i++) {
            ret = "0" + ret;
        }
        return ret;
    }

    return function (requestedCodec, numAvailableOptions) {
      var multi = {
        validCodecs: ["APPROVAL", "MEEK-STV"],
        numAvailableOptions: numAvailableOptions,

        /**
         * Converts a vote into a BigInt. A vote in this case is a list of
         * answer ids (which must always be positive non-zero integers),
         * for example [1, 3].
         *
         * Note that answer ids cannot be zero because it would cause encoding
         * problems. Next step is converting those number to strings of fixed
         * size:
         *
         * [1, 3] -> ['01', '03']
         *
         * We need to be sure that each option will always be encoded using the
         * the same number of characters so that decoding the options is
         * possible in a deterministic way. So if we have 24 options, we know
         * that we can codify any of those options with 2 characters, but if we
         * have 110 options we need three chars per option.
         *
         * Next step is to concatenate the ordered list of option strings:
         *
         * [1, 3] -> ['01', '03'] -> '0103'
         *
         * After that, we have a number to be encrypted. We convert this number
         * to integer and then to a BigInt, and return it:
         *
         * [1, 3] -> ['01', '03'] -> '0103' -> 103 -> BigInt(103)
         *
         * NOTE: the zeros at the left of the final number are removed, because
         * a number representation never has any zeros at the left. When
         * doing decoding of the result you should take this into account.
         */
        encode: function(answer) {
            var numChars = (numAvailableOptions + 2).toString(10).length;
            var encodedAnswer = _.reduce(answer, function (memo, answerId) {
                return numberToString(answerId, numChars) + memo;
            }, "");

            // blank vote --> make it not count numAvailableOptions + 2;
            if (encodedAnswer.length === 0) {
                encodedAnswer = numberToString(numAvailableOptions + 2, numChars);
            }
            var ret_val = new BigIntService(encodedAnswer, 10);

            return ret_val;
        },

        /**
         * Does exactly the reverse of of encodeQuestionAnswer. It should be
         * such as the following statement is always true:
         *
         * data == codec.decode(codec.encode(answer))
         *
         * This function is very useful for sanity checks.
         */
        decode: function(encodedAnswer) {
            var encodedStr = encodedAnswer.toJSONObject();
            var length = encodedStr.length;
            var tabNumChars = (numAvailableOptions + 2).toString(10).length;
            var missingZeros = (tabNumChars - (length % tabNumChars)) % tabNumChars;
            var i;
            var decodedAnswer = [];

            // check if it's a blank vote
            if (parseInt(encodedStr, 10) === numAvailableOptions + 2) {
                return [];
            }

            // add zeros to the left for tabulation
            for (i = 0; i < missingZeros; i++) {
                encodedStr = "0" + encodedStr;
            }

            // decode each option
            for (i = 0; i < (encodedStr.length / tabNumChars); i++) {
                var optionStr = encodedStr.substr(i*tabNumChars, tabNumChars);
                var optionId = parseInt(optionStr, 10);
                decodedAnswer.push(optionId);
            }
            return decodedAnswer;
        },

        // question is optional
        sanityCheck: function(question) {
          try {
            var possibleAnswers = _.times(numAvailableOptions, function(n) {
              return n + 1; });

            if (question !== undefined) {
              possibleAnswers = _.pluck(question.answer, "id");
            }

            // TODO do a test with specific input and output values

            // test 10 random ballots. Note, we won't honor the limits of number
            // of options for this question for simplicity, we'll just do some
            // tests to assure everything is fine.
            for (var i = 0; i < 10; i++) {
                // generate answer
                var answer = [];
                var randomNumOptions = Math.ceil(Math.random() * 10000) % possibleAnswers.length;
                for (var j = 0; j < randomNumOptions; j++) {
                    var rnd = Math.ceil(Math.random() * 10000) % possibleAnswers.length;
                    var opt = possibleAnswers[rnd];
                    // do not duplicate options
                    if (_.indexOf(answer, opt) === -1) {
                        answer.push(opt);
                    }
                }
                // check encode -> decode pipe doesn't modify the ballot
                var encodedAnswer = this.encodeQuestionAnswer(answer);
                var decodedAnswer = stringify(this.decodeQuestionAnswer(encodedAnswer));
                if (stringify(answer) !== decodedAnswer) {
                    return false;
                }
              }

              // test blank vote
              var encoded = this.encodeQuestionAnswer([]);
              var decoded = stringify(this.decodeQuestionAnswer(encoded));
              if (stringify([]) !== decoded) {
                  return false;
              }
          // if any any exception is thrown --> sanity check didnt pass
          } catch (e) {
            return false;
          }

          // if everything whent right
          return true;
        }
      };
      var codecs = [multi];

      var foundCodec = _.find(codecs, function (codec) {
        return _.contains(codec.validCodecs, requestedCodec);
      });

      if (!foundCodec.length) {
        throw "unknown answer encoding service requested: " + requestedCodec;
      }

      return foundCodec;
    };
  });

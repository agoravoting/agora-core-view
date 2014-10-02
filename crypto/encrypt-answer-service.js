/*
  usage:

    var encryptor = EncryptBallotService.init(pk);
    var ctext = encryptor.encryptAnswer(23);

  dependencies

  jsbn.js
  jsbn2.js
  bigint.js
  class.js
  elgamal.js
  random.js
  sha1.js
  sha2.js
  sjcl.js
*/

angular.module('avCrypto')
  .service('EncryptAnswerService', function(ElGamalService, BigIntService, RandomService, DeterministicJsonStringifyService) {
    return function (publicKeyJson) {
      // private members
      var publicKeyJsonCopy = publicKeyJson;
      var publicKey = ElGamalService.PublicKey.fromJSONObject(publicKeyJsonCopy);
      var proof2;

      // public interface
      return {

        // randomness argument is optional, used just for unit testing really
        encryptAnswer: function(plain_answer, randomness) {
          if (!angular.isNumber(plain_answer)) {
            throw "plain_answer must be an int";
          }
          var plaintext = new ElGamalService.Plaintext(
            BigIntService.fromInt(plain_answer),
            publicKey,
            true);
          if (!randomness) {
            randomness = RandomService.getRandomInteger(publicKey.q);
          } else if (!angular.isNumber(randomness)) {
            throw "randomness must be an int";
          }
          var ctext = ElGamalService.encrypt(publicKey, plaintext, randomness);
          // obtains proof of plaintext knowledge (schnorr protocol)
          var proof = plaintext.proveKnowledge(
            ctext.alpha,
            randomness,
            ElGamalService.fiatshamir_dlog_challenge_generator);
          var ciphertext =  ctext.toJSONObject();
          var jsonProof = proof.toJSONObject();
          var enc_answer = {
            alpha: ciphertext.alpha,
            beta: ciphertext.beta,
            commitment: jsonProof.commitment,
            response: jsonProof.response,
            challenge: jsonProof.challenge
          };

          return enc_answer;
        },

        getPublicKey: function() {
          return publicKeyJson;
        },

        // verifies the proof of plaintext knowledge (schnorr protocol)
        verifyPlaintextProof: function(encrypted) {
          var ctext = new ElGamalService.Ciphertext(
            BigIntService.fromInt(encrypted.alpha),
            BigIntService.fromInt(encrypted.beta),
            publicKey);
          var proof = new ElGamalService.DLogProof(
            new ElGamalService.PlaintextCommitment(
              BigIntService.fromInt(encrypted.alpha),
              BigIntService.fromInt(encrypted.commitment)
            ),
            BigIntService.fromInt(encrypted.challenge),
            BigIntService.fromInt(encrypted.response));

          return ctext.verifyPlaintextProof(
            proof,
            ElGamalService.fiatshamir_dlog_challenge_generator);
        }
      };
    };
  });

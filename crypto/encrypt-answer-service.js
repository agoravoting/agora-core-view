/*
  adapted from the singleton pattern (http://addyosmani.com/resources/essentialjsdesignpatterns/book/#singletonpatternjavascript)

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
  .service('EncryptAnswerService', function(ElGamalService, BigIntService, RandomService) {
    function _init(publicKeyJson) {
      // private members
      var publicKeyJsonCopy = publicKeyJson;
      var publicKey = ElGamalService.PublicKey.fromJSONObject(publicKeyJsonCopy);

      // public interface
      return {

        // randomness argument is optional, used just for unit testing really
        encryptAnswer: function(plain_answer, randomness) {
          var plaintext = new ElGamalService.Plaintext(BigIntService.fromInt(plain_answer), publicKey, true);
          if (!randomness) {
            randomness = RandomService.getRandomInteger(publicKey.q);
          }
          var ctext = ElGamalService.encrypt(publicKey, plaintext, randomness);
          // obtains proof of plaintext knowledge (schnorr protocol)
          var proof = plaintext.proveKnowledge(ctext.alpha, randomness, ElGamalService.fiatshamir_dlog_challenge_generator);
          var ciphertext =  ctext.toJSONObject();
          var enc_answer = {
            alpha: ciphertext.alpha,
            beta: ciphertext.beta,
            commitment: proof.commitment,
            response: proof.response,
            challenge: proof.challenge
          };

          return enc_answer;
        },

        getPublicKey: function() {
          return publicKeyJson;
        },

        // verifies the proof of plaintext knowledge (schnorr protocol)
        verifyPlaintextProof: function(encrypted) {
          var ctext = new ElGamalService.Ciphertext(BigIntService.fromInt(encrypted.alpha), BigIntService.fromInt(encrypted.beta), publicKey);
          var proof = new ElGamalService.DLogProof(encrypted.commitment, encrypted.challenge, encrypted.response);

          return ctext.verifyPlaintextProof(proof, ElGamalService.fiatshamir_dlog_challenge_generator);
        }
      };
    }

    return {
      init: function(publicKeyJson) {
        return _init(publicKeyJson);
      }
    };
  });

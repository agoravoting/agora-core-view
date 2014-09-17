/*
  adapted from the singleton pattern (http://addyosmani.com/resources/essentialjsdesignpatterns/book/#singletonpatternjavascript)

  usage:

    var encryptor = AgoraEncryptor.init(pk);
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

var AgoraEncryptor = (function() {

  function _init(publicKeyJson) {
    // private members
    var publicKeyJson = publicKeyJson;
    var publicKey = ElGamal.PublicKey.fromJSONObject(publicKeyJson);

    // public interface
    return {

      encryptAnswer: function(plain_answer) {
        var plaintext = new ElGamal.Plaintext(BigInt.fromInt(plain_answer), publicKey, true);
        var randomness = Random.getRandomInteger(publicKey.q);
        var ctext = ElGamal.encrypt(publicKey, plaintext, randomness);
        // obtains proof of plaintext knowledge (schnorr protocol)
        var proof = plaintext.proveKnowledge(ctext.alpha, randomness, ElGamal.fiatshamir_dlog_challenge_generator);
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
        var ctext = new ElGamal.Ciphertext(BigInt.fromInt(encrypted.alpha), BigInt.fromInt(encrypted.beta), publicKey);
        var proof = new ElGamal.DLogProof(encrypted.commitment, encrypted.challenge, encrypted.response);

        return ctext.verifyPlaintextProof(proof, ElGamal.fiatshamir_dlog_challenge_generator);
      }
    };
  };

  return {
    init: function(publicKeyJson) {
      return _init(publicKeyJson);
    }
  };

})();
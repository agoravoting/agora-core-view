/*
 * ConfigService is a function that returns the configuration that exists
 * in this same file, which you might want to edit and tune if needed.
 */

var avConfigData = {
  // the base url path for ajax requests, for example for sending ballots or
  // getting info about an election. This url is usually in the form of
  // 'https://foo/api/v3/' and always ends in '/'.
  baseUrl: "/temp_data/",

  // default language of the application
  language: "es",

  // if we are in debug mode or not
  debug: true,

  // contact data where users can reach to a human when they need it
  contact: {
    email: "contact@example.com",
    twitter: "agoravoting"
  },

  help: {
    info:"<p>To contact us, send an email to <a href=\"mailto:contacto@example.com\">contacto@example.com</a>.</p>"
  },

  success: {
    text: "<p>El localizador de tu voto es:</p></h3><p> <strong>{{ballotHash}}</strong></p><p>Puedes usar tu localizador desde *enlace* para verificar que tu voto cuenta. Además, podrás verificarlo una vez hecho el recuento. Mientras que la votación esté en curso, puedes votar de nuevo, sobreescribiendo e invalidando cualquier voto que hayas emitido anteriormente en esta votación. Tienes más información sobre los detalles de la votación en *enlace*.</p><p></p><h2 class=\"text-center\"><a target=\"_blank\" href=\"https://twitter.com/share?url=https://vota.example.info\">¡Twitea esta votación!</a></h2></div>"
  }
};

angular.module('avConfig', [])
  .factory('ConfigService', function() {
      return avConfigData;
  });

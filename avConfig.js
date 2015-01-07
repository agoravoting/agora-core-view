/*
 * ConfigService is a function that returns the configuration that exists
 * in this same file, which you might want to edit and tune if needed.
 */

var avConfigData = {
  // the base url path for ajax requests, for example for sending ballots or
  // getting info about an election. This url is usually in the form of
  // 'https://foo/api/v3/' and always ends in '/'.
  baseUrl: "http://agora.dev/elections/api/",

  // AuthApi base url
  authAPI: "http://agora.dev/authapi/",
  // Agora Elections base url
  electionsAPI: "http://agora.dev/elections/",

  // default language of the application
  language: "es",

  // if we are in debug mode or not
  debug: true,

  // contact data where users can reach to a human when they need it
  contact: {
    email: "contacto@podemos.info",
    twitter: "ahorapodemos"
  },

  help: {
    info:"<p>Puedes encontrar más información sobre la votación en los siguientes enlaces:</p><ul><li><a href=\"https://vota.podemos.info/doc/faqs.html\" target=\"_blank\">Preguntas Frecuentes</a></li><li><a href=\"https://vota.podemos.info/doc/auths.html\" target=\"_blank\">Lista de Autoridades</a></li><li><a href=\"https://vota.podemos.info/doc/overview.html\" target=\"_blank\">Esquema General</a></li><li><a href=\"https://vota.podemos.info/doc/tech_overview_1016.pdf\" target=\"_blank\">Descripción técnica (en inglés)</a></li></ul><p>Si quieres, puedes ponerte en contacto con nosotros enviando un email a <a href=\"mailto:contacto@ahorapodemos.info\">contacto@podemos.info</a>.</p>"
  },

  success: {
    text: "<p>¡Enhorabuena! Ya has emitido tu voto con <a href=\"https://agoravoting.com\" target=\"_blank\">Agora Voting</a>. El localizador de tu voto es:</p></h3><p> <strong>{{ballotHash}}</strong></p><p>Puedes usar tu localizador desde la aplicación móvil de podemos para verificar que tu voto ha quedado registrado. Mientras que la votación esté en curso, puedes votar de nuevo, sobreescribiendo e invalidando cualquier voto que hayas emitido anteriormente en esta votación. Para más información sobre la votación:</p><ul><li><a href=\"https://vota.podemos.info/doc/faqs.html\" target=\"_blank\">Preguntas Frecuentes</a></li><li><a href=\"https://vota.podemos.info/doc/auths.html\" target=\"_blank\">Lista de Autoridades</a></li><li><a href=\"https://vota.podemos.info/doc/overview.html\" target=\"_blank\">Esquema General</a></li><li><a href=\"https://vota.podemos.info/doc/tech_overview_1016.pdf\" target=\"_blank\">Descripción técnica (en inglés)</a></li></ul><h2 class=\"text-center\"><a target=\"_blank\" href=\"https://twitter.com/share?url=https://podemos.info\">¡Twitea esta votación!</a></h2></div>"
  },

  tos: {
    text:"",
    tile: ""
  }
};

angular.module('avConfig', [])
  .factory('ConfigService', function() {
      return avConfigData;
  });

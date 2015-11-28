/*
 * Given a string, it return false if it's not a youtube url, or the embeddable
 * url if it is.
 */
angular.module('avUi')
  .service('YoutubeEmbedUrlService', function() {
    return function (url) {
      var rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
      var match = url.match(rx);
      if (!match) {
        return false;
      }
      return "https://youtube.com/embed/" + match[1];
    };
  });

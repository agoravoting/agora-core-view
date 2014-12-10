/*
 * Given a number, adds dots every three digits.
 *
 * Example:
 *
 *    AddDotsToIntService(1234567) --> "1.234.567"
 */
angular.module('avUi')
  .service('AddDotsToIntService', function() {
    return function (number) {
      var number_str = number + "";
      var ret = "";
      for (var i = 0; i < number_str.length; i++) {
        var reverse = number_str.length - i;
        if ((reverse % 3 === 0) && reverse > 0 && i > 0) {
          ret = ret + ".";
        }
        ret = ret + number_str[i];
      }
      return ret;
    };
  });

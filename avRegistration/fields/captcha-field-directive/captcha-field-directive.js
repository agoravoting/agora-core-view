angular.module('avRegistration')
  .directive('avrCaptchaField', ['Authmethod', '$state', '$interval', function(Authmethod, $state, $interval) {
    function link(scope, element, attrs) {
        var timeoutId = null;

        scope.view = function() {
            Authmethod.newCaptcha()
                .success(function(data) {
                    console.log(data);
                    if (data.captcha_code !== null) {
                        Authmethod.captcha_code = data.captcha_code;
                        scope.image_url = data.image_url;
                    } else {
                        scope.status = 'Not found';
                        document.querySelector(".input-error").style.display = "block";
                    }
                })
                .error(function(error) {
                    scope.status = 'Scan error: ' + error.message;
                    document.querySelector(".input-error").style.display = "block";
                });
        };
        scope.view();


        function checkReloadCaptcha() {
            if (Authmethod.reload_captcha) {
                scope.view();
                Authmethod.reload_captcha = false;
            }
        }

        element.on('$destroy', function() {
            $interval.cancel(timeoutId);
        });

        timeoutId = $interval(function() { checkReloadCaptcha(); }, 1000);
    }

    return {
      restrict: 'AE',
      scope: true,
      link: link,
      templateUrl: 'avRegistration/fields/captcha-field-directive/captcha-field-directive.html'
    };
  }]);

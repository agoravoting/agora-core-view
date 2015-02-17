angular.module('avRegistration')
  .directive('avrCaptchaField', function(Authmethod, $state) {
    function link(scope, element, attrs) {
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
    }

    return {
      restrict: 'AE',
      scope: true,
      link: link,
      templateUrl: 'avRegistration/fields/captcha-field-directive/captcha-field-directive.html'
    };
  });

/* jshint ignore:start */
(function () {
  function createElement(name, attrs) {
    var el = document.createElement(name);
    for (var key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
    return el;
  }

  var votingBooths = document.getElementsByClassName("agoravoting-voting-booth");
  for (var i = 0; i < votingBooths.length; i++) {
    var boothLink = votingBooths[i];
    var href = boothLink.getAttribute("href");
    var funcName = boothLink.getAttribute("data-authorization-funcname");
    window.avRequestAuthorizationFuncName = funcName;
    var iframe = createElement("iframe", {
      "class": "agoravoting-voting-booth-iframe",
      "src": href,
      "style": "border: 0; width: 100%; height: 100%",
      "seamless": ""
    });
    boothLink.parentNode.insertBefore(iframe, boothLink);
    boothLink.parentNode.removeChild(boothLink);
  }
  function requestAuthorization(e) {
    var reqAuth = "avRequestAuthorization:";
    if (e.data.substr(0, reqAuth.length) !== reqAuth) {
      return;
    }

    function callback(khmac) {
      e.source.postMessage('avPostAuthorization:' + khmac, '*');
    }

    var args = [
      JSON.parse(e.data.substr(reqAuth.length, e.data.length)),
      callback
    ];
    window[window.avRequestAuthorizationFuncName].apply(window, args);
  }
  window.addEventListener('message', requestAuthorization, false);
})();
/* jshint ignore:end */
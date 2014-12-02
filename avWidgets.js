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
    console.log("calling requestAuthorization");
    var reqAuth = "avRequestAuthorization:";
    if (e.data.substr(0, reqAuth.length) !== reqAuth) {
      return;
    }

    var data = JSON.parse(e.data.substr(reqAuth.length, e.data.length));
    var khmac = window[window.avRequestAuthorizationFuncName].apply(window, data);
    e.source.postMessage('avPostAuthorization:' + khmac, '*');
  }
  console.log("adding event listener requestAuthorization");
  window.addEventListener('message', requestAuthorization, false);
})();
/* jshint ignore:end */
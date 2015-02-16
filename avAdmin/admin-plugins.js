angular.module('avAdmin')
    .factory('AdminPlugins', function() {
        var plugins = {};
        plugins.plugins = [];

        plugins.add = function(name, icon, head, text) {
            var p = {name: name, icon: icon, head: head, text: text};
            plugins.plugins.push(p);
        };

        return plugins;
    });

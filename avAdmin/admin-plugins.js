angular.module('avAdmin')
    .factory('AdminPlugins', function() {
        var plugins = {};
        plugins.plugins = [];

        plugins.add = function(p) {
            // plugin format
            // {
            //  name: 'test',
            //  directive: 'test', (optional, only if this link has a directive)
            //  head: true | false,
            //  link: ui-sref link,
            //  menu: html() | {icon: icon, text: text}
            // }
            plugins.plugins.push(p);
        };

        plugins.reload = function(np) {
            var ps = plugins.plugins;
            plugins.plugins = [];
            ps.forEach(function(p) {
                if (np.name === p.name) {
                    plugins.plugins.push(np);
                } else {
                    plugins.plugins.push(p);
                }
            });
        };

        plugins.clear = function() {
            plugins.plugins = [];
        };

        return plugins;
    });

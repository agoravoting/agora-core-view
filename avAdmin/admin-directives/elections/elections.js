angular.module('avAdmin')
  .directive('avAdminElections', function() {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
        scope.elections = [];
        scope.page = 1;
        scope.loading = false;
        scope.nomore = false;
        scope.elections = [];

        function loadMoreElections() {
            if (scope.loading || scope.nomore) {
                return;
            }
            scope.loading = true;

            // fake request with a timeout to view the loading message
            function timeout() {
                scope.loading = false;
                var desc = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor. Praesent et diam eget libero egestas mattis sit amet vitae augue. Nam tincidunt congue enim, ut porta lorem lacinia consectetur. Donec ut libero sed arcu vehicula ultricies a non tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut gravida lorem. Ut turpis felis, pulvinar a semper sed, adipiscing id dolor. Pellentesque auctor nisi id magna consequat sagittis. Curabitur dapibus enim sit amet elit pharetra tincidunt feugiat nisl imperdiet. Ut convallis libero in urna ultrices accumsan. Donec sed odio eros. Donec viverra mi quis quam pulvinar at malesuada arcu rhoncus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In rutrum accumsan ultricies. Mauris vitae nisi at sem facilisis semper ac in est.";
                var elections = [
                    {title:"Example" + scope.page, description:desc, status:"registered", votes:10000, votes_percentage:50},
                    {title:"Example" + scope.page, description:desc, status:"created", votes:10000, votes_percentage:50},
                    {title:"Example" + scope.page, description:desc, status:"voting", votes:10000, votes_percentage:50},
                    {title:"Example" + scope.page, description:desc, status:"stopped", votes:10000, votes_percentage:50},
                    {title:"Example" + scope.page, description:desc, status:"tally", votes:10000, votes_percentage:50},
                ];

                if (scope.page < 4) {
                    elections.forEach(function(el) { scope.elections.push(el); });
                    scope.page += 1;
                } else {
                    scope.nomore = true;
                }
                scope.$apply();
            }
            setTimeout(function() {timeout(); }, 500);
        }

        angular.extend(scope, {
          loadMoreElections: loadMoreElections,
        });
    }

    return {
      restrict: 'AE',
      scope: {
      },
      link: link,
      templateUrl: 'avAdmin/admin-directives/elections/elections.html'
    };
  });

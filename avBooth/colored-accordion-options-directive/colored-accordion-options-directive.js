/*
 * Accordion Options directive.
 *
 * Lists the available options for a question, grouping options via their
 * category. Used by avbAvailableOptions directive.
 */
angular.module('avBooth')
  .directive('avbColoredAccordionOptions', function($timeout) {

    var link = function(scope, element, attrs) {

      function getUrl(option, title) {
        return _.filter(option.urls, function (url) {
          return url.title === title;
        })[0];
      }

      function getTag(option) {
        var url = getUrl(option, "Tag");
        if (!url) {
          return null;
        }
        return url.url.replace("https://agoravoting.com/api/tag/", "").replace("_", " ");
      }

      // set supported flag
      _.each(scope.options, function (option) {

        option.supported = angular.isUndefined(
          _.find(option.urls, function(u) {
            return u.title.toLowerCase() === 'support' && u.url.split('/').slice(-1)[0] === 'FALSE';
          }));

        option.tag = getTag(option);

        var splittedCat = option.category.split(' > ');
        option.topCategory = splittedCat[0];
        if (splittedCat.length > 1) {
          option.subCategory = splittedCat[1];
        } else {
          option.subCategory = null;
        }
      });

      // group by category
      var categories = _.groupBy(scope.options, "category");

      scope.folding_policy = undefined;
      if (angular.isDefined(scope.question.extra_options)) {
        scope.folding_policy = scope.question.extra_options.accordion_folding_policy;
      }

      // top categories have no ' > ' string inside
      categories = _.map(_.pairs(categories), function (pair) {
        return {
          title: pair[0],
          subTitle: pair[1][0].subCategory,
          answers: pair[1]
        };
      });

      var topCategories = _.uniq(_.map(
        categories, function(cat) { return cat.title.split(' > ')[0]; }));
      window.topCategories = topCategories;
      window.categories = categories;

      // convert this associative array to a list of objects with title and
      // options attributes
      scope.categories = _.map(topCategories, function(catTitle) {
        var opts = _.find(categories, function(cat) {
          return cat.title === catTitle;
        });

        return {
          title: catTitle,
          options: _.filter(scope.options, function(opt) {
            return catTitle === opt.topCategory;
          }),
          topOptions: opts ? opts.answers : [],

          subCategories: [].concat(_.filter(
            categories, function(subcat) {
              return (subcat.title.indexOf(catTitle + ' > ') !== -1);
            })),
          isOpen: (scope.folding_policy === "unfold-all")
        };
      });

      scope.nonEmptyCategories = _.filter(scope.categories, function (cat) {
        return !!cat.title && cat.title.length > 0;
      });

      scope.emptyCategory = _.find(scope.categories, function (cat) {
        return !(!!cat.title && cat.title.length > 0);
      });

      if (!scope.emptyCategory) {
        scope.emptyCategory = {title: "", options: [], isOpen: true};
      }

      scope.categoryIsSelected = function(category) {
        return _.filter(category.options, function (el) {
          return el.selected > -1;
        }).length === category.options.length;
      };

      scope.deselectAll = function(category) {
        _.each(category.options, function(el) {
          if (el.selected > -1) {
            scope.toggleSelectItem2(el);
          }
        });
      };

      scope.numSelectedOptions = function () {
        return _.filter(
          scope.options,
          function (element) {
            return element.selected > -1 || element.isSelected === true;
          }).length;
      };

      scope.selectColored = function() {
        $timeout(function() {
            $(".supported").each(function() {
                $(this).children()[0].click();
            });
        }, 0);
      };
    };

    return {
      restrict: 'AE',
      scope: true,
      link: link,
      templateUrl: 'avBooth/colored-accordion-options-directive/colored-accordion-options-directive.html'
    };
  });

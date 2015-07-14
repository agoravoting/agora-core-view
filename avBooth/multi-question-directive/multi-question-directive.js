/*
 * Multiquestion directive.
 *
 * Shows a question and its possible answers to the user.
 */
angular.module('avBooth')
  .directive('avbMultiQuestion', function($modal) {

    var link = function(scope, element, attrs) {
      scope.stateData.affixIsSet = false;
      scope.stateData.affixDropDownShown = false;
      scope.hideSelection = false;

      scope.getUrl = function(option, title) {
        return _.filter(option.urls, function (url) {
          return url.title === title;
        })[0];
      };

      scope.getTag = function(option) {
        var url = scope.getUrl(option, "Tag");
        if (!url) {
          return null;
        }
        return url.url.replace("https://agoravoting.com/api/tag/", "");
      };

      // set options' tag
      scope.tagName = scope.stateData.question.extra_options.restrict_choices_by_tag__name;
      _.each(scope.stateData.question.answers, function (element) {
        element.tag = null;
        if (angular.isDefined(scope.tagName) && scope.getTag(element) === scope.tagName) {
          element.tag = scope.tagName;
        }
      });

      scope.numSelectedOptions = function () {
        return _.filter(
          scope.stateData.question.answers,
          function (element) {
            return element.selected > -1 || element.isSelected === true;
          }).length;
      };

      scope.numTaggedSelectedOptions = function() {
        var val = _.filter(
          scope.stateData.question.answers,
          function (element) {
            return (element.selected > -1 || element.isSelected === true) &&
              element.tag === scope.tagName;
          }).length;
        return val;
      };

      scope.tagMax = null;
      if (angular.isDefined(scope.stateData.question.extra_options.restrict_choices_by_tag__max)) {
        scope.tagMax = parseInt(scope.stateData.question.extra_options.restrict_choices_by_tag__max, 10);
      }
      scope.tagName = scope.stateData.question.extra_options.restrict_choices_by_tag__name;


      var question = scope.stateData.question;
      if (question.layout === "") {
        question.layout = "simple";
      }
      if (_.contains(['circles'], question.layout)) {
        scope.hideSelection = true;
      }
      if (question.randomize_answer_order) {
          // we can't just sample the groupedOptions list because we need to
          // 1. use the same list object
          // 2. generate a specific ordering for all the options
          var i = -1;
          var answers = question.answers;
          var shuffledNumbers = _.shuffle(_.map(answers, function () { i += 1; return i;}));
          // map different sort orders
          var shuffledAnswers = _.map(shuffledNumbers, function (index) { return answers[index].sort_order;});
          // now, assign
          _.each(answers, function (opt, index) { opt.sort_order = shuffledAnswers[index];});
          answers.sort(function (item1, item2) { return item1.sort_order - item2.sort_order; });
          scope.stateData.question.answers = answers;
      }

      // questionNext calls to scope.next() if user selected enough options.
      // If not, then it flashes the #selectMoreOptsWarning div so that user
      // notices.
      scope.questionNext = function() {
        if (scope.numSelectedOptions() < scope.stateData.question.min) {
          $("#selectMoreOptsWarning").flash();
          return;
        }

        // show null vote warning
        if (scope.numSelectedOptions() === 0) {
          $modal.open({
            templateUrl: "avBooth/confirm-null-vote-controller/confirm-null-vote-controller.html",
            controller: "ConfirmNullVoteController",
            size: 'md'
          }).result.then(scope.next);
        } else {
          scope.next();
        }
      };
    };

    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'avBooth/multi-question-directive/multi-question-directive.html'
    };
  });
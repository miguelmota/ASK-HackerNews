'use strict';

var test = require('tape');
var api = require('../libs/api');

test('api', function (t) {
  t.plan(30);

  var storyTypes = ['top', 'new', 'show', 'ask', 'jobs', 'best', 'active', 'noob'];
  storyTypes.forEach(function(type) {
    api.getStories({
      type: type,
      count: 10,
      page: 1
    }).then(function(stories) {
      var titles = stories.map(function(story) {
        return story.title;
      }).filter(function(title) {
        return !!title;
      });

      if (type !== 'noob') {
        t.equal(stories[stories.length - 1].index, 9)
      }

      t.equal(titles.length, 10);

      api.getStories({
        type: type,
        count: 10,
        page: 2
      }).then(function(nextStories) {
        var titles = nextStories.map(function(story) {
          return story.title;
        }).filter(function(title) {
          return !!title;
        });

        t.equal(titles.length, 10);

        if (type !== 'noob') {
          t.equal(stories[stories.length - 1].index + 1, nextStories[0].index)
        }
      });
    });
  });
});

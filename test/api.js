'use strict';

var test = require('tape');
var api = require('../libs/api');

test('api', function (t) {
  t.plan(8);

  var storyTypes = ['top', 'new', 'show', 'ask', 'jobs', 'best', 'active', 'noob'];

  storyTypes.forEach(function(type) {
    api.getStories({
      type: type,
      count: 5,
      page: 1
    }).then(function(stories) {
      var titles = stories.map(function(story) {
        return story.title;
      }).filter(function(title) {
        return !!title;
      });

      t.equal(titles.length, 5);
    });
  });
});

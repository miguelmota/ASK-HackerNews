'use strict';

var test = require('tape');
var api = require('../libs/api');

test('api', function (t) {
  t.plan(4);

  api.getTopStories({
    count: 5
  }).then(function(stories) {
    var titles = stories.map(function(story) {
      return story.title;
    });

    t.equal(titles.length, 5);
  });

  api.getNewStories({
    count: 5
  }).then(function(stories) {
    var titles = stories.map(function(story) {
      return story.title;
    });

    t.equal(titles.length, 5);
  });

  api.getJobStories({
    count: 5
  }).then(function(stories) {
    var titles = stories.map(function(story) {
      return story.title;
    });

    t.equal(titles.length, 5);
  });

  api.getShowStories({
    count: 5
  }).then(function(stories) {
    var titles = stories.map(function(story) {
      return story.title;
    });

    t.equal(titles.length, 5);
  });
});

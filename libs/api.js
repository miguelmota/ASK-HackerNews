'use strict';

var _ = require('lodash');
var request = require('request');
var Q = require('q');

var baseUrl = 'https://hacker-news.firebaseio.com/v0/';
var apiUrls = {
  topStories: baseUrl + 'topstories.json',
  newStories: baseUrl + 'newstories.json',
  jobStories: baseUrl + 'jobstories.json',
  askStories: baseUrl + 'askstories.json',
  showStories: baseUrl + 'showstories.json',
  story: baseUrl + 'item/{{id}}.json'
};

var http = {
  get: function(url, params) {
    var deferred = Q.defer();

    if (params instanceof Object) {
      for (var key in params) {
        url = url.replace('{{' + key + '}}', params[key]);
      }
    }

    request({
      url: url,
      json: true
    }, function(error, response, body) {
      if (error) {
        deferred.reject(error);
        return false;
      }

      deferred.resolve(body);
    });

    return deferred.promise;
  }
};

var api = {
  getStory: function(id) {
    if (typeof id !== 'number') {
      return Q.reject(new TypeError('`id` must be a number.'));
    }

    return http.get(apiUrls.story, {
      id: id
    });
  },

  getStories: function(options) {
    var deferred = Q.defer();

    if (!(options instanceof Object)) {
      options = {};
    }

    var defaults = {
      count: 10,
      type: 'top'
    };

    _.defaults(options, defaults);

    if (typeof options.count !== 'number') {
      options.count = defaults.count;
    }

    if (typeof options.type !== 'string') {
      options.type = defaults.type;
    }

    var count = options.count;
    var stories = [];

    var checkCount = function() {
      if (--count === 0) {
        if (options.top) {
          stories.sort(this.topScoreSort);
        }
        deferred.resolve(stories);
      }
    }.bind(this);

    var typeUrl = apiUrls[options.type + 'Stories'];

    if (typeof typeUrl !== 'string') {
      typeUrl = apiUrls.topStories;
    }

    http.get(typeUrl).then(function(storyIds) {
      if (!Array.isArray(storyIds)) {
        throw new Error('StoryIds not returned.');
      }
      storyIds.slice(0, count).forEach(function(id) {
        api.getStory(id).then(function(story) {
          stories.push(story);

          checkCount();
        }.bind(this)).catch(function(error) {
          console.error(error);
          checkCount();
        });
      });
    }.bind(this)).catch(function(error) {
      console.error(error);
      deferred.reject(error);
    });

    return deferred.promise;
  },

  getTopStories: function(options) {
    return this.getStories(_.extend({}, options, {
      type: 'top'
    }));
  },

  getNewStories: function(options) {
    return this.getStories(_.extend({}, options, {
      type: 'new'
    }));
  },

  getJobStories: function(options) {
    return this.getStories(_.extend({}, options, {
      type: 'job'
    }));
  },

  getAskStories: function(options) {
    return this.getStories(_.extend({}, options, {
      type: 'ask'
    }));
  },

  getShowStories: function(options) {
    return this.getStories(_.extend({}, options, {
      type: 'show'
    }));
  },

  topScoreSort: function(a, b) {
    if (a.score < b.score) {
      return 1;
    } else if (a.score > b.score) {
      return -1;
    }

    return 0;
  }
};

module.exports = api;

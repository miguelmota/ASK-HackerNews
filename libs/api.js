'use strict';

var _ = require('lodash');
var request = require('request');
var Q = require('q');
var cheerio = require('cheerio');

var baseUrl = 'https://news.ycombinator.com';
var baseApiUrl = 'https://hacker-news.firebaseio.com/v0';

var apiUrls = {
  topStories: baseUrl + '/',
  newStories: baseUrl + '/newest',
  showStories: baseUrl + '/show',
  askStories: baseUrl + '/ask',
  jobStories: baseUrl + '/jobs',
  bestStories: baseUrl + '/best',
  activeStories: baseUrl + '/active',
  noobStories: baseUrl + '/noobstories',
  story: baseApiUrl + '/item/{id}}.json'
};

var pendingPromises = {};

var queue = {
  inProgress: false,

  queue: [],

  enqueue: function(fn) {
    this.queue.push(fn);

    if (!this.inProgress) {
      this.dequeue();
    }
  },

  dequeue: function() {
    if (this.inProgress) {
      return false;
    }

    var fn = this.queue.shift();

    if (typeof fn === 'function') {
      var promise = fn();
      if (typeof promise === 'object') {
        this.inProgress = true;
        return promise.then(function() {
          this.inProgress = false;
          this.dequeue();
        }.bind(this)).catch(function() {
          this.inProgress = false;
          this.dequeue();
        }.bind(this));
      }
    }
  }
};

var http = {
  get: function(url, params) {
    var deferred = Q.defer();

    if (params instanceof Object) {
      for (var key in params) {
        url = url.replace('{{' + key + '}}', params[key]);
      }
    }

    if (typeof params.page === 'number' && params.page > 1) {
      url += ('?p=' + params.page);
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
  /**
   * Parsing page is faster than making a call
   * to each individual story.
   */
  parsePage: function(page, type) {
    if (page.length < 600) {

    }
    var $ = cheerio.load(page);

    var $table = $('.itemlist');
    var $rows = $table.find('.athing');

    var stories = [];

    $rows.each(function() {
      var $next = $(this).next('tr');
      var $subtext = $next.find('.subtext');
      var $title = $(this).find('.title');
      var $comments = $subtext.find('a').last();
      var by = $subtext.find('a').first().text();
      var descendants = ($comments.text().replace(/[^\d]+/, '') >>> 0);
      var id = ($comments.attr('href').replace(/[^\d]+/, '') >>> 0);
      var score = ($next.find('.score').text().replace(/[^\d]+/, '') >>> 0);
      var time = $next.find('.age').text();
      var url =  $title.find('a').attr('href');
      var title =  $title.find('a').first().text();
      var domain = $title.find('.sitebit').find('a').text();
      var index = ($title.find('.rank').text().replace(/[^\d]+/, '') >>> 0);

      if (typeof index !== 'number') {
        index = 0;
      } else {
        index--;
      }

      if (typeof type !== 'string') {
        type = null;
      }

      var isItemUrl = !/https?:\/\//gi.test(url) && /item\?id=/gi.test(url);

      if (isItemUrl) {
        url = baseUrl + '/' + url;
      }

      var story = {
        by: by,
        descendants: descendants,
        id: id,
        score: score,
        time: time,
        title: title,
        type: type,
        url: url,
        domain: domain,
        index: index
      };

      stories.push(story);
    });

    return stories;
  },

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
      page: 1,
      type: 'top'
    };

    _.defaults(options, defaults);

    if (typeof options.count !== 'number') {
      options.count = defaults.count;
    }

    if (options.count < 1) {
      options.count = 1;
    } else if (options.count > 30) {
      options.count = 30;
    }

    if (typeof options.page !== 'number') {
      options.page = defaults.page;
    }

    if (options.page < 1) {
      options.page = 1;
    }

    if (typeof options.type !== 'string') {
      options.type = defaults.type;
    }

    var storyType = options.type + 'Stories';
    var pendingPromiseHash = storyType + '-' + options.toString();

    var pendingPromise = pendingPromises[pendingPromiseHash];
    if (pendingPromise instanceof Object &&
        pendingPromise.isPending()) {
      return pendingPromise.then(function(page) {
        pendingPromises[pendingPromiseHash] = null;
        handleResponse(page);
      }).catch(handleFailure);
    }

    var typeUrl = apiUrls[storyType];

    if (typeof typeUrl !== 'string') {
      typeUrl = apiUrls.topStories;
    }

    var perPage = 30;
    var requestedPage = options.page;
    var count = options.count;
    var limit = count * requestedPage;
    var callPage = 1;
    var startSlice = count * (requestedPage - 1);

    if (limit > perPage) {
      callPage = parseInt(limit / perPage) + 1;
      startSlice = limit % perPage;
    }

    var endSlice = startSlice + count;

    var fn = function() {
      pendingPromises[pendingPromiseHash] = http.get(typeUrl, {
        page: callPage
      });

      pendingPromises[pendingPromiseHash].then(function(page) {
        handleResponse(page);
      }).catch(handleFailure);

      return pendingPromises[pendingPromiseHash];
    };

    queue.enqueue(fn);

    var handleResponse = function(page) {
      var stories = this.parsePage(page, options.type).sort(this.indexSort);

      deferred.resolve(stories.slice(startSlice, endSlice));
    }.bind(this);

    var handleFailure = function(error) {
      console.error(error);
      deferred.reject(error);
    };

    return deferred.promise;
  },

  topScoreSort: function(a, b) {
    if (a.score < b.score) {
      return 1;
    } else if (a.score > b.score) {
      return -1;
    }

    return 0;
  },

  indexSort: function(a, b) {
    if (a.index > b.index) {
      return 1;
    } else if (a.index < b.index) {
      return -1;
    }

    return 0;
  }
};

module.exports = api;

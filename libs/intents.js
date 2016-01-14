'use strict';

var _ = require('lodash');
var pluralize = require('pluralize');
var api = require('./api');
var i18n = require('./i18n');

module.exports = {
  'AMAZON.HelpIntent': HelpIntent,

  ReadTopStoriesIntent: ReadTopStoriesIntent,

  ReadNewStoriesIntent: ReadNewStoriesIntent,

  ReadJobStoriesIntent: ReadJobStoriesIntent,

  ReadAskStoriesIntent: ReadAskStoriesIntent,

  ReadShowStoriesIntent: ReadShowStoriesIntent
};

function HelpIntent(intent, session, response) {
  response.ask(i18n.help);
}

function ReadTopStoriesIntent(intent, session, response) {
  var count = _.get(intent, ['slots', 'Count', 'value'], 25);

  if (count < 5) {
    count = 5;
  } else if (count > 50) {
    count = 50;
  }

  api.getTopStories({
    count: count
  }).then(function(stories) {
    var speech = stories.map(function(story, i) {
      var initialText = i18n.nextStory;

      if (i === 0) {
        initialText = i18n.topStory;
      }
      if (stories.length - 1 === i) {
        initialText = i18n.lastStory;
      }

      return initialText + ' with ' + story.score + ' ' + pluralize('points', story.score) + ', ' + story.title + ',';
    }).join(' ');

    response.ask('Here are the top ' + count + ' stories,' + speech);
  }).catch(function(error) {
    response.tell(i18n.errorRetrievingTopStories) ;
  });
}

function ReadNewStoriesIntent(intent, session, response) {
  var count = _.get(intent, ['slots', 'Count', 'value'], 25);

  if (count < 5) {
    count = 5;
  } else if (count > 50) {
    count = 50;
  }

  api.getNewStories({
    count: count
  }).then(function(stories) {
    var speech = stories.map(function(story, i) {
      var initialText = i18n.nextStory;

      if (i === 0) {
        initialText = i18n.firstStory;
      }
      if (stories.length - 1 === i) {
        initialText = i18n.lastStory;
      }

      return initialText + ' with ' + story.score + ' ' + pluralize('points', story.score) + ', ' + story.title + '.';
    }).join(' ');

    response.tell('Here are the latest ' + count + ' stories, ' + speech);
  }).catch(function(error) {
    response.tell(i18n.errorRetrievingNewStories) ;
  });
}

function ReadJobStoriesIntent(intent, session, response) {
  var count = _.get(intent, ['slots', 'Count', 'value'], 15);

  if (count < 5) {
    count = 5;
  } else if (count > 15) {
    count = 15;
  }

  api.getJobStories({
    count: count
  }).then(function(stories) {
  console.log('her33e')
    var speech = stories.map(function(story, i) {
      var initialText = i18n.nextStory;

      if (i === 0) {
        initialText = i18n.firstStory;
      }
      if (stories.length - 1 === i) {
        initialText = i18n.lastStory;
      }

      return initialText + ' with ' + story.score + ' ' + pluralize('points', story.score) + ', ' + story.title + '.';
    }).join(' ');

    response.tell('Here are the latest ' + count + ' job stories, ' + speech);
  }).catch(function(error) {
  console.log('her33esdf')
    response.tell(i18n.errorRetrievingJobStories) ;
  });
}

function ReadAskStoriesIntent(intent, session, response) {
  var count = _.get(intent, ['slots', 'Count', 'value'], 25);

  if (count < 5) {
    count = 5;
  } else if (count > 50) {
    count = 50;
  }

  api.getAskStories({
    count: count
  }).then(function(stories) {
    var speech = stories.map(function(story, i) {
      var initialText = i18n.nextStory;

      if (i === 0) {
        initialText = i18n.firstStory;
      }
      if (stories.length - 1 === i) {
        initialText = i18n.lastStory;
      }

      return initialText + ' with ' + story.score + ' ' + pluralize('points', story.score) + ', ' + story.title + '.';
    }).join(' ');

    response.tell('Here are the latest ' + count + ' ask hacker news stories, ' + speech);
  }).catch(function(error) {
    response.tell(i18n.errorRetrievingAskStories) ;
  });
}

function ReadShowStoriesIntent(intent, session, response) {
  var count = _.get(intent, ['slots', 'Count', 'value'], 25);

  if (count < 5) {
    count = 5;
  } else if (count > 50) {
    count = 50;
  }

  api.getShowStories({
    count: count
  }).then(function(stories) {
    var speech = stories.map(function(story, i) {
      var initialText = i18n.nextStory;

      if (i === 0) {
        initialText = i18n.firstStory;
      }
      if (stories.length - 1 === i) {
        initialText = i18n.lastStory;
      }

      return initialText + ' with ' + story.score + ' ' + pluralize('points', story.score) + ', ' + story.title + '.';
    }).join(' ');

    response.tell('Here are the latest ' + count + ' show hacker news stories, ' + speech);
  }).catch(function(error) {
    response.tell(i18n.errorRetrievingShowStories) ;
  });
}

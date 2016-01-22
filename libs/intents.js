'use strict';

var _ = require('lodash');
var pluralize = require('pluralize');
var capitalize = require('capitalize');
var api = require('./api');
var i18n = require('./i18n');

var intents = {
  'AMAZON.HelpIntent': HelpIntent,
  'AMAZON.YesIntent': YesIntent,
  'AMAZON.NoIntent': NoIntent,
  'AMAZON.CancelIntent': CancelIntent,
  ReadTopStoriesIntent: ReadTopStoriesIntent,
  ReadNewStoriesIntent: ReadNewStoriesIntent,
  ReadShowStoriesIntent: ReadShowStoriesIntent,
  ReadAskStoriesIntent: ReadAskStoriesIntent,
  ReadJobStoriesIntent: ReadJobStoriesIntent,
  ReadBestStoriesIntent: ReadBestStoriesIntent,
  ReadActiveStoriesIntent: ReadActiveStoriesIntent,
  ReadNoobStoriesIntent: ReadNoobStoriesIntent
};

function HelpIntent(intent, session, response) {
  var speech = i18n.helpInstructions + ' ' + i18n.seeHelpCard + ' ' + i18n.helpPrompt;
  var cardTitle = i18n.help;
  var cardContent = i18n.helpInstructions + ' ' + i18n.helpContact;

  response.askWithCard(speech, i18n.helpInstructions, cardTitle, cardContent);
}

function YesIntent(intent, session, response) {
  if (session.attributes.readMore) {
    if (session.attributes.storyType) {
      session.attributes.page += 1;
      return readStories(intent, session, response, {
        type: session.attributes.storyType,
        page: session.attributes.page
      });
    }
  }

  return response.tell('');
}

function NoIntent(intent, session, response) {
  if (session.attributes.readMore) {
    if (session.attributes.storyType) {
      return response.tell(i18n.exit);
    }
  }

  return response.tell('');
}

function CancelIntent(intent, session, response) {
  return response.tell(i18n.exit);
}

function ReadTopStoriesIntent(intent, session, response) {
  return readStories(intent, session, response, {
    type: 'top'
  });
}

function ReadNewStoriesIntent(intent, session, response) {
  return readStories(intent, session, response, {
    type: 'new'
  });
}

function ReadShowStoriesIntent(intent, session, response) {
  return readStories(intent, session, response, {
    type: 'show'
  });
}

function ReadAskStoriesIntent(intent, session, response) {
  return readStories(intent, session, response, {
    type: 'ask'
  });
}

function ReadJobStoriesIntent(intent, session, response) {
  return readStories(intent, session, response, {
    type: 'job'
  });
}

function ReadBestStoriesIntent(intent, session, response) {
  return readStories(intent, session, response, {
    type: 'best'
  });
}

function ReadActiveStoriesIntent(intent, session, response) {
  return readStories(intent, session, response, {
    type: 'active'
  });
}

function ReadNoobStoriesIntent(intent, session, response) {
  return readStories(intent, session, response, {
    type: 'noob'
  });
}

function readStories(intent, session, response, options) {
  var count = (_.get(intent, ['slots', 'Count', 'value'], 10) >> 0);
  var type = options.type;
  var page = options.page;

  if (typeof page !== 'number') {
    page = 1;
  }

  session.attributes.storyType = type;
  session.attributes.page = page;

  return api.getStories({
    type: type,
    count: count,
    page: page
  }).then(function(stories) {
    var cardTitle = i18n[type + 'Stories'];
    var cardContent = generateStoriesCardContent(stories);

    var nextOrLatest = page > 1 ? 'next' : 'latest';

    var startStoriesSpeech = 'Here are the ' + nextOrLatest + ' ' + count + ' ' + type + ' Hacker News stories';

    var speech = i18n.noStories;

    if (stories.length > 1) {
      var speech = startStoriesSpeech + ', ' + generateStorySpeech(stories) + '. ' + i18n.hearMoreStories;
      session.attributes.readMore = true;
      response.askWithCard(speech, i18n.hearMoreStories, cardTitle, cardContent);
    }

    return speech;
  }).catch(function(error) {
    response.tell(i18n['errorRetrieving' + capitalize(type) + 'Stories']);

    return error;
  });
}

function generateStorySpeech(stories) {
  var speech = stories.map(function(story, i) {
    var initialText = i18n.nextStory;

    if (i === 0) {
      initialText = i18n.firstStory;
    }
    if (stories.length - 1 === i) {
      initialText = i18n.lastStory;
    }

    return initialText + ' with ' + story.score + ' ' + pluralize('points', story.score) + ' from ' + story.domain + ', ' + story.title + '.';
  }).join(' ');

  return speech;
}

function generateStoriesCardContent(stories) {
  var cardContent = stories.map(function(story, i) {
    var n = i + 1;
    return n + '. (' + story.score + ') ' + story.title + ' ' + story.url;
  }).join('\n');

  return cardContent;
}

module.exports = intents;

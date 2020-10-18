
const commandProcessor = require('@cmd-ctrl/core/CommandProcessor');

/**
 * TODO: 
 * 1.) Make all core domain objects immutable: Event, CommandHandler
 * 2.) Add mongoose schema to core domain objects Event, CommandHandler
 * 3.) implement proper database
 * 4.) consider hwo to make domain obejct immutable, eg: Metrics? Can this be done with mongoose?
 * 5.) Find better way to handle commadn for unknown events, perhaps first event is special case? process, get id, then queue up others. 
 * 6.) add npm modules
 * 
 */


 // Track the entity each command creates/mutates
let createdEntity = undefined;

const modulePath = '@metrics/survey/mqbank';

describe('CQRS', function () {

  describe('metrics and question bank', function () {

    it('create new metrics', function () {
      // These are "HttpCommands", eg: what we'd expect in body of http posts to submit command to a rest api endpoint:
      const postBody1 = { entityType: 'Metric', action: 'Create', modulePath: modulePath, mutation: { metricName: 'Love/Hate' } };
      const postBody2 = { entityType: 'Metric', entityId: '', action: 'AddQuestionTo', modulePath: modulePath, mutation: { question: 'Do you love it or hate it?', answers: ['love', 'like', 'neutral', 'dislike', 'hate'], answerType: 'SingleCode' } };

      // Process commands as if there were incoming via a stream
      const httpCommands = [postBody1, postBody2];
      httpCommands.forEach((httpCmd) => {
        const { Command } = require(`@metrics/survey/mqbank/commands/${httpCmd.action}${httpCmd.entityType}`);
        if (createdEntity) httpCmd.entityId = createdEntity.id;
        const command = new Command(httpCmd);
        createdEntity = commandProcessor.process(command);
      });
    });

  });

});
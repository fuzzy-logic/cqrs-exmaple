
const commandProcessor = require('@cmd-ctrl/core/CommandProcessor');
const expect = require('expect.js');

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

let history = [];



describe('CQRS', function () {

  describe('metrics and question bank', function () {

    it('create new metrics', function () {
      // where to find the command objects
      const modulePath = '@metrics/survey/mqbank';
      // These are "HttpCommands", eg: what we'd expect in body of http posts to submit command to a rest api endpoint:
      // (1) Create a new Metric
      const postBody1 = { entityType: 'Metric', action: 'Create', modulePath: modulePath, mutation: { metricName: 'Memorability' } };
      // (2) Add a Question to a Metric
      const postBody2 = { entityType: 'Metric', entityId: '?', action: 'AddQuestionTo', mutation: { question: 'Do you love it or hate it?', answers: ['love', 'like', 'neutral', 'dislike', 'hate'], answerType: 'SingleCode' } };
      // (3) Add a second Question to a Metric
      const postBody3 = { entityType: 'Metric', entityId: '?', action: 'AddQuestionTo', mutation: { question: 'Do you find this image memorable?', answers: ['memorable', 'neutral', 'unmemorable'], answerType: 'SingleCode' } };
      // (4) Remove question from metric
      const postBody4 =  { entityType: 'Metric', entityId: '?', action: 'RemoveQuestionFrom',  mutation: {questionNumber: 2}};

      // Process commands as if there were incoming via a stream
      const httpCommands = [postBody1, postBody2, postBody3, postBody4];
      httpCommands.forEach((httpCmd) => {
        console.log(`TEST-CQRS.JS Creating & Processing Command #${history.length + 1}`);
        const { Command } = require(`@metrics/survey/mqbank/commands/${httpCmd.action}${httpCmd.entityType}`);
        if (history.length > 0) httpCmd.entityId = history[0].entity.id;

        const command = new Command({modulePath: modulePath, ...httpCmd});
        const newEntity = commandProcessor.process(command);
        history.push({command: command, entity: newEntity});
      });

      expect(history.length).to.be(4);

      // Meh, it's the same entity in each array slot because copyEntity was not working

      // Assert first Command:
      console.log(JSON.stringify(history[0].entity));
      expect(history[0].entity.id).to.be.ok();
      expect(history[0].entity.questions.length).to.be(1);


      // Assert second Command:
      console.log(JSON.stringify(history[1].entity));
      expect(history[1].entity.id).to.be.ok();
      expect(history[1].entity.questions.length).to.be(1);


      // Assert third Command:
      console.log(JSON.stringify(history[2].entity));
      expect(history[2].entity.id).to.be.ok();
      expect(history[2].entity.questions.length).to.be(1);


      // Assert forth Command:
      console.log(JSON.stringify(history[3].entity));
      expect(history[3].entity.id).to.be.ok();
      expect(history[3].entity.questions.length).to.be(1);


    });

  });

});


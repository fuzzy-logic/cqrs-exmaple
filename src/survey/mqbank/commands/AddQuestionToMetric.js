const logger = require('sexylog');
const Command = require('@cmd-ctrl/core/model/Command');
const CommandHandler = require('@cmd-ctrl/core/model/CommandHandler');
const Event = require('@cmd-ctrl/core/model/Event');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  question:  { type: String, immutable: true, required: true },
  answers:  { type: Array, immutable: true, default: []},
  order: {type: Number, ummutable: true, required: false},
  answerType:  { type: String, immutable: true, required: true },
});

const Mutation = mongoose.model('AddQuestionToMetricMutation', schema);


module.exports.Command = function(command) {
    command.mutation = new Mutation(command.mutation); // validate the mutation
    return Command(command);
}



module.exports.Handler = class AddQuestionToMetricCommandHander extends CommandHandler {
    execute()  {
        // logger.trace(`AddQuestionToMetricCommandHander: this.entity=${JSON.stringify(this.entity)}`);
        // logger.trace(`AddQuestionToMetricCommandHander: this.command=${JSON.stringify(this.command)}`);
        const question = this.command.mutation;
        question.order = this.entity.questions.length + 1;
        logger.trace(`question=${JSON.stringify(question)}`);
        this.entity.questions.push(question);
        return this.entity;
    }
}


module.exports.Event = class QuestionAddedToMetricEvent extends Event {
    constructor(eventParams) {
        const payload =  eventParams.mutation;
        super(eventParams, payload);
    }
}

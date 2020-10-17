
const Command = require('../../core/Command');
const CommandHandler = require('../../core/CommandHandler');
const Event = require('../../core/Event');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  question:  { type: String, immutable: true, required: true },
  answers:  { type: Array, immutable: true, default: []},
  answerType:  { type: String, immutable: true, required: true },
});

const Mutation = mongoose.model('AddQuestionToMetricMutation', schema);


module.exports.Command = function(command) {
    command.mutation = new Mutation(command.mutation); // validate the mutation
    return Command(command);
}



module.exports.Handler = class AddQuestionToMetricCommandHander extends CommandHandler {
    execute()  {
        // console.log(`AddQuestionToMetricCommandHander: this.entity=${JSON.stringify(this.entity)}`);
        //console.log(`AddQuestionToMetricCommandHander: this.command=${JSON.stringify(this.command)}`);
        const question = this.command.mutation;
        console.log(`AddQuestionToMetricCommandHander: question=${JSON.stringify(question)}`);
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

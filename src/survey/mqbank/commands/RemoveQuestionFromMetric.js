const logger = require('sexylog');
const Command = require('@cmd-ctrl/core/model/Command');
const CommandHandler = require('@cmd-ctrl/core/model/CommandHandler');
const Event = require('@cmd-ctrl/core/model/Event');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    questionNumber:  { type: Number, immutable: true, required: true },
});

const Mutation = mongoose.model('RemoveQuestionFromMetricMutation', schema);


module.exports.Command = function(command) {
    command.mutation = new Mutation(command.mutation); // validate the mutation
    return Command(command);
}



module.exports.Handler = class RemoveQuestionFromMetricCommandHander extends CommandHandler {
    execute()  {
        logger.debug(`questionId=${this.command.mutation.questionId}`);
        this.entity.questions = this.entity.questions.filter((q) => {
            //logger.trace(`filtering for question.order=${q.order} !== ${this.command.mutation.questionNumber}`);
            return q.order !== this.command.mutation.questionNumber
        });
        return this.entity;
    }
}


module.exports.Event = class QuestionRemovedFromMetricEvent extends Event {
    constructor(eventParams) {
        const payload =  eventParams.mutation;
        super(eventParams, payload);
    }
}

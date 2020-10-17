
const Command = require('../../core/Command');
const CommandHandler = require('../../core/CommandHandler');
const Event = require('../../core/Event');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  metricName:  { type: String, immutable: true, required: true },
});
const CreateMetricMutation = mongoose.model('CreateMetricMutation', schema);


module.exports.Command = function(command) {
    command.mutation = new CreateMetricMutation(command.mutation); // validate the mutation
    return Command(command);
}



module.exports.Handler = class CreateMetricCommandHander extends CommandHandler {
    execute()  {
        const entity = {
            id: this.genId(),
            type: 'Metric',
            name: this.command.mutation.metricName,
            active: true,
            questions: [],
        }
        return entity;
    }
}


module.exports.Event = class QuestionAddedToMetricEvent extends Event {
    constructor(eventParams) {
        const payload =  {active:true};
        super(eventParams, payload);
    }
}

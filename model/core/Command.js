const mongoose = require('mongoose');
const { Schema } = mongoose;


const commandSchema = new Schema({
  entityId:  { type: String, immutable: true, default: undefined }, 
  entityType: { type: String, immutable: true, required: true },
  action:   { type: String, immutable: true, required: true },
  mutation:  { type: Object, immutable: true, default: {} },
  date: { type: Date, default: Date.now, immutable: true },
}, /* this allows virtual funcs to print out: */ { toJSON: { virtuals: true } });

// Add virtual method to compose command name:
commandSchema.virtual('name').get(function() {
  return this.action + this.entityType + 'Command';
});

const Command = mongoose.model('Command', commandSchema);


module.exports = Command;





// module.exports = class Command {
//     constructor(entityId, action, entityType, mutation) {
//       this.entityId = entityId;
//       this.entityType = entityType;
//       this.action = action;
//       this.mutation = mutation;
//       Object.freeze(this);
//     }

//     get name() {
//       return this.action + this.entityType; 
//     }
//   }
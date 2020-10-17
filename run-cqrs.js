

/**
 * TODO: 
 * 1.) Make all core domain objects immutable: Event, CommandHandler
 * 2.) Add mongoose schema to core domain objects Event, CommandHandler
 * 3.) implement proper database
 * 4.) consider hwo to make domain obejct immutable, eg: Metrics? Can this be done with mongoose?
 * 5.) Find better way to handle commadn for unknown events, perhaps first event is special case? process, get id, then queue up others. 
 * 
 * 
 */

// Mock persistance
const db = {};

// once first command creates an object, we keep track of db id here:
let createdEntityId = undefined;

console.log('running cqrs test...');


// These are "HttpCommands", eg: what we'd expect in body of http posts to submit command to a rest api endpoint:
const postBody1 = {entityType: 'Metric', action: 'Create', mutation: {metricName: 'Love/Hate'}};
const postBody2 = {entityType: 'Metric', entityId: '', action: 'AddQuestionTo', mutation: {question: 'Do you love it or hate it?', answers: ['love', 'like', 'neutral', 'dislike', 'hate'], answerType: 'SingleCode'}};

// Process commands as if there were incoming via a stream
const httpCommands = [postBody1, postBody2];
httpCommands.forEach((httpCmd) => {
    const {Command} = require(`./model/mqbank/commands/${httpCmd.action}${httpCmd.entityType}`);
    if (createdEntityId !== undefined)  {
        console.log(`setting httpCmd.entityId=${createdEntityId}`);
        httpCmd.entityId = createdEntityId;
    }
    const command = new Command(httpCmd);
    runCQRS(command);
});


//  
/**
 * fucntion to processes Commands, this is where the magic happens:
 * @param {*} command a Command object
 * 
 * these are the steps:
 * 
 * 1.) load entity via id (if exists)
 * 2.) load command handler & event via action/type concatentation
 * 3.) provide handler with command + entity to process command 
 * 4.) todo: error handling 
 * 5.) handler returns new entity state
 * 6.) save entity
 * 7.) todo: save command
 * 7.) fire event
 * 8.) todo: save event
 * 
 */
function runCQRS(command) {
    // running, load entity:
    console.log(`runCQRS() processing command: ${JSON.stringify(command)}`);
    const entity = loadEntity(command.entityType, command.entityId);
    //console.log(`runCQRS() loaded entity: ${JSON.stringify(entity)}`);

    // execute handler
    const {Handler, Event} = require(`./model/mqbank/commands/${command.action}${command.entityType}`);
    const handler = new Handler(entity, command);
    const newEntity = handler.execute();
    if (entity === undefined) createdEntityId = newEntity.id; // we don't id of newly cerated object, so keep track of it here
    saveEntity(newEntity);

    //fire event
    const event = new Event(command);
    console.log(`runCQRS() firing event: '${event.name}' ${JSON.stringify(event)}`);
}






function loadEntity(entityType, entityId) {
  let types = db[entityType];
  if (types === undefined) return undefined;
 const entity = db[entityType][entityId];
 console.log(`loadEntity(${entityType}, ${entityId}) entity=${JSON.stringify(entity)}`);
 return entity;
}

function saveEntity(entity) {
    if (db[entity.type] === undefined) db[entity.type] = {};
    console.log(`saveEntity() saving db[${entity.type}][${entity.id}] entity=${JSON.stringify(entity)}`);
    db[entity.type][entity.id] = entity;
}




   



const logger = require('sexylog');



// Mock persistance
const db = {};

// FAKE DB STUFF

function loadEntity(entityType, entityId) {
    let types = db[entityType];
    if (types === undefined) return undefined;
    const entity = db[entityType][entityId];
    logger.trace(`loadEntity(${entityType}, ${entityId}) entity=${JSON.stringify(entity)}`);
    return entity;
}

function saveEntity(entity) {
    if (db[entity.type] === undefined) db[entity.type] = {};
    logger.trace(`saveEntity() saving db[${entity.type}][${entity.id}] entity=${JSON.stringify(entity)}`);
    db[entity.type][entity.id] = entity;
}



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
function process(command) {
    // running, load entity:
    logger.info(`processing command '${command.name}'`);
    logger.trace(`command=${JSON.stringify(command)}`);
    const entity = loadEntity(command.entityType, command.entityId);
    //console.log(`CommandProcessor.process() loaded entity: ${JSON.stringify(entity)}`);

    // execute handler
    const { Handler, Event } = require(`${command.modulePath}/commands/${command.action}${command.entityType}`);
    const handler = new Handler(entity, command);
    const newEntity = handler.execute();
    saveEntity(newEntity);

    //fire event
    const event = new Event(command);
    logger.debug(`Firing event: '${event.name}'`);
    logger.trace(`Event:  ${JSON.stringify(event)}`);
    return newEntity;
}

module.exports.process = process;






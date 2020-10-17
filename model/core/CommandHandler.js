const { v4: uuidv4 } = require('uuid');

module.exports = class Command {
    constructor(entity, command) {
      this.entity = this.copyEntity(entity);
      this.command  = command;
      Object.freeze(this);
    }

    copyEntity(inObject) {
        let outObject, value, key

        if (typeof inObject !== "object" || inObject === null) {
          return inObject // Return the value if inObject is not an object
        }
      
        // Create an array or object to hold the values
        outObject = Array.isArray(inObject) ? [] : {}
      
        for (key in inObject) {
          value = inObject[key]
      
          // Recursively (deep) copy for nested objects, including arrays
          outObject[key] = this.copyEntity(value)
        }
        return outObject
    }

    genId() {
      return  uuidv4();
    }
  }
module.exports = class Event {
    constructor(eventParams, payload) {
      this.entityId = eventParams.entityId;
      this.entityType = eventParams.entityType;
      this.action = eventParams.action;
      this.created = new Date();
      this.eventName = this.constructor.name;
      this.payload = payload;
      Object.freeze(this);
      Object.freeze(payload);
    }

    get name() {
      return this.eventName;
    }

    // // Method to immutably set event payload
    // setPayload(obj) {
    //   for(var key in obj) this.payload[key]=obj[key];
    //   Object.freeze(this.payload);
    // }
  }
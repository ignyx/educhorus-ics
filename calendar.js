// Generator
const ics = require('ics');
// Parser
const ical = require('node-ical');
const {
  writeFileSync
} = require('fs');

const fileLocation = process.env.FILE ? process.env.FILE : 'ehorus.ics';

const events = ical.sync.parseFile(fileLocation);
let classes = [];

function modifyEvent(event) {
  return {
    start: [event.start.getUTCFullYear(), event.start.getUTCMonth() + 1, event.start.getUTCDate(), event.start.getUTCHours(), event.start.getUTCMinutes()],
    startInputType: 'utc',
    startOutputType: 'utc',
    end: [event.end.getUTCFullYear(), event.end.getUTCMonth() + 1, event.end.getUTCDate(), event.end.getUTCHours(), event.end.getUTCMinutes()],
    endInputType: 'utc',
    endOutputType: 'utc',
    title: event.description.split('Matière : ')[1],
    uid: event.uid,
    description: event.summary,
    location: event.location,
    status: event.status,
    busyStatus: 'BUSY',
    alarms: [{
      action: 'display',
      trigger: {
        minutes: 30,
        before: true
      },
    }]
  }
}

Object.values(events).forEach((event) => classes.push(modifyEvent(event)));

ics.createEvents(classes, (error, value) => {
  if (error) {
    return console.log(error);
  }

  writeFileSync(`${__dirname}/modified-classes.ics`, value);
})

'use strict'

console.time('Total Time:');

const dotenv = require('dotenv').config();
const Promise = require('bluebird');
const twilio = require('twilio')(process.env.accountSID, process.env.authToken);


// Sends a request to Twilio to send a 'message' to all phone numbers in the
// provided [numbers] array
const sendReminders = (message, numbers) => {
  if (message.length >= 100) {
    console.log('Message was too long. Must be under 100 characters.');
    return;
  };

  const sendMessage = Promise.promisify(twilio.sendMessage);

  // Builds array of promise chains that send text messages
  let textMessages = numbers.map(number => sendMessage({
    to: number,
    from: '+15082834493',
    body: message
  })
    .then(message => console.log('Message success: ', number))
    .catch(err => console.log('Message Failure:\n', err)));

  return Promise.all(textMessages);
};

// Returns an array of {Date} objects representing all of a given dayOfTheWeek
// (integer, 1 = Mon, 2 = Tues, 3 = Wed, etc) in the month of the provided {date}
const getNthDays = (date, dayOfWeek) => {
  let days = [];

  const daysInMonth = () => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  for (let i = 1; i < daysInMonth(); i++) {
    const day = new Date(date.getFullYear(), date.getMonth(), i)

    if (day.getDay() === dayOfWeek) {
      days.push(day);
    };
  }

  return days;
}

// Returns the {Date} before the provided {date}, even if the day before is
// in the previous month
const dayBefore = (date) => {
  date.setDate(date.getDate() - 1);
  return date;
}

/* Stores all information about each household
 * - phone numbers of those to receive notifications
 * - conditions for when reminders should be sent
 * - the text message content for each reminder condition
 */
const households = {
  wallaceStreet: {
    numbers: [
      process.env.alex,
      process.env.julia,
      process.env.pat,
      process.env.peter
    ],
    reminders: {
      firstAndThirdTuesday: {
        condition: function() {
          const now = new Date();
          const tuesdays = getNthDays(now, 2);

          return now.getDate() === dayBefore(tuesdays[0]).getDate() ||
                 now.getDate() === dayBefore(tuesdays[2]).getDate();
        },
        message: 'Street Sweeping tonight! Park on the OTHER side.'
      },
      secondAndFourthWednesday: {
        condition: function() {
          const now = new Date();
          const wednesdays = getNthDays(now, 3);

          return now.getDate() === dayBefore(wednesdays[1]).getDate() ||
                 now.getDate() === dayBefore(wednesdays[3]).getDate();
        },
        message: 'Street Sweeping tonight! Park on OUR side.'
      }
    }
  },
  harvardStreet: {
    numbers: [
      process.env.zach,
      process.env.pete,
      process.env.aristide
    ],
    reminders: {
      firstMonday: {
        condition: function() {
          const now = new Date();
          const mondays = getNthDays(now, 1);

          return now.getDate() === dayBefore(mondays[0]).getDate();
        },
        message: 'Street Sweeping tonight! Park on OUR side.'
      },
      firstTuesday: {
        condition: function() {
          const now = new Date();
          const tuesdays = getNthDays(now, 2);

          return now.getDate() === dayBefore(tuesdays[0]).getDate();
        },
        message: 'Street Sweeping tonight! Park on the OTHER side.'
      }
    }
  }
}

/* Iterates through {households} object, checks if any reminders should be sent
 * at the present time, and returns a promise chain if their specific
 * conditions are met
 */
const checkAndSend = households => {

  // Loop through each household
  let householdReminders = Object.keys(households).map(household => {
    const reminders = households[household].reminders;

    // Loop through each household's reminders
    let remindersToSend = Object.keys(reminders).map(reminder => {
      const shouldSendReminder = households[household]
        .reminders[reminder].condition();

      // Send only if the reminder's condition is true
      if (shouldSendReminder) {
        const message = households[household].reminders[reminder].message;
        const numbers = households[household].numbers;

        return sendReminders(message, numbers);
      } else {
        console.log('Wrong day. No messages sent.');
      }
    });

    return Promise.all(remindersToSend);
  });

  return Promise.all(householdReminders);
};

checkAndSend(households).then(() => {
  console.timeEnd('Total Time:');
});

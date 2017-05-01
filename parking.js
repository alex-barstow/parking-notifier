'use strict'

const dotenv = require('dotenv').config();
const twilio = require('twilio');

const sendMessage = twilio(process.env.accountSID, process.env.authToken).sendMessage;

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
  console.log(dayOfWeek, days);
  return days;
}

// Sends a request to Twilio to send a 'message' to all phone numbers in the
// provided [numbers] array
const sendReminders = (message, numbers) => {
  if (message.length >= 100) {
    console.log('Message was too long. Must be under 100 characters.');
    return;
  };

  // Sends texts messages
  numbers.forEach(number => sendMessage({
    to: number,
    from: '+15082834493',
    body: message
  }, (err, message) => {
    if (err) {
      console.log('Something went wrong:\n', err);
    } else {
      console.log('message sent to ', number);
    }
  }));
};

/* Stores all information about each household
 * - phone numbers of those to receive notifications
 * - conditions for when reminders should be sent
 * - the text message content for each reminder condition
 */
const households = {
  wallaceStreet: {
    numbers: [
      process.env.alex,
      process.env.pat,
      process.env.julia,
      process.env.peter,
    ],
    reminders: {
      firstAndThirdMonday: {
        condition: function() {
          const now = new Date();
          const mondays = getNthDays(now, 1);

          return now.getDate() === mondays[0].getDate() ||
                 now.getDate() === mondays[2].getDate();
        },
        message: 'Street Sweeping tonight! Park on the OTHER side.'
      },
      secondAndFourthTuesday: {
        condition: function() {
          const now = new Date();
          const tuesdays = getNthDays(now, 2);

          return now.getDate() === tuesdays[1].getDate() ||
                 now.getDate() === tuesdays[3].getDate();
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

          return now.getDate() === mondays[0].getDate();
        },
        message: 'Street Sweeping tonight! Park on the OTHER side.'
      },
      firstTuesday: {
        condition: function() {
          const now = new Date();
          const tuesdays = getNthDays(now, 2);

          return now.getDate() === tuesdays[0].getDate();
        },
        message: 'Street Sweeping tonight! Park on OUR side.'
      }
    }
  }
}

/* Iterates through {households} object, checks if any reminders should be sent
 * at the present time, and sends them with the correct message if their specific
 * conditions are met
 */
const checkAndSend = households => {

  // Loop through each household
  Object.keys(households).forEach(household => {
    const reminders = households[household].reminders;

    // Loop through each households reminders
    Object.keys(reminders).forEach(reminder => {
      const shouldSendReminder = households[household]
        .reminders[reminder].condition();

      // Send only if the reminder's condition is true
      if (shouldSendReminder) {
        const message = households[household].reminders[reminder].message;
        const numbers = households[household].numbers;

        sendReminders(message, numbers);
      };
    });
  });
};

checkAndSend(households);

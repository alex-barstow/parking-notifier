'use strict'

const dotenv = require('dotenv').config();
const twilio = require('twilio');
const client = twilio(process.env.accountSID, process.env.authToken);


const households = {
  wallaceStreet: {
    numbers: [
      process.env.alex,
      process.env.julia,
      process.env.pat,
      process.env.peter,
    ],
    reminders: {
      firstAndThirdMonday: {
        condition: function() {
          const now = new Date();
          const mondays = getNthDays(now, 1);

          return now.getDate() === mondays[0].getDate() || now.getDate() === mondays[2].getDate();
        },
        message: 'Street Sweeping tonight! Park on the OTHER side.'
      },
      secondAndFourthTuesday: {
        condition: function() {
          const now = new Date();
          const tuesdays = getNthDays(now, 2);

          return now.getDate() === tuesdays[1].getDate() || now.getDate() === tuesdays[3].getDate()
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

          return now.getDate() === mondays[0].getDate()
        },
        message: 'Street Sweeping tonight! Park on the OTHER side.'
      },
      firstTuesday: {
        condition: function() {
          const now = new Date();
          const tuesdays = getNthDays(now, 2);

          return now.getDate() === tuesdays[0].getDate()
        },
        message: 'Street Sweeping tonight! Park on OUR side.'
      }
    }
  }
}

// Returns an array of {Date} objects representing all of a given dayOfTheWeek
// (integer, 1 = Mon, 2 = Tues, 3 = Wed, etc) in the month of the provided {date}
const getNthDays = (date, dayOfWeek) => {
  let days = [];

  let daysInMonth = () => {
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return lastDay.getDate();
  };

  for (let i = 1; i < daysInMonth(); i++) {
    const day = new Date(date.getFullYear(), date.getMonth(), i)
    if (day.getDay() === dayOfWeek) {
      days.push(day);
    }
  }
  console.log(dayOfWeek, days);
  return days;
}

// Sends a request to Twilio to send a message to all phone numbers in the
// provided numbers array
const sendReminders = (message, numbers) => {
  if (message.length < 100) {
    numbers.forEach((number) => {
      client.sendMessage({
        to: number,
        from: '+15082834493',
        body: message
      });
      console.log(`Sent to "${number}"`);
    })
    console.log(`Message: "${message}"`);
  }
}

// Iterates through {households} object, checks if any reminders should be sent
// at the present time, and sends them with the correct message if their specific
// conditions are met
const checkAndSend = (households) => {
  for (var household in households) {
    if (households.hasOwnProperty(household)) {
      const reminders = households[household].reminders;

      for (var reminder in reminders) {
        if (reminders.hasOwnProperty(reminder)) {
          const shouldSendReminder = households[household].reminders[reminder].condition();

          if (shouldSendReminder) {
            const message = households[household].reminders[reminder].message;
            const numbers = households[household].numbers;

            sendReminders(message, numbers);
          } else {
            console.log('Wrong day. No messages sent.');
          }
        }
      }
    }
  }
}

checkAndSend(households);

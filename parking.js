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
  console.log(days);
  return days;
}

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

// Needs refactor to allow for multiple households
// function checkAndSendHarvard() {
//   const now = new Date();
//   const mondays = getNthDays(now, 1);
//   const tuesdays = getNthDays(now, 2);
//
//   if (now.getDate() === mondays[0].getDate()) {
//     sendMessage('Street Sweeping tonight! Park on OUR side.', households.harvardStreetNumbers)
//   } else if(now.getDate() === tuesdays[0].getDate()) {
//     sendMessage('Street Sweeping tonight! Park on the OTHER side.', households.harvardStreetNumbers)
//   else {
//     console.log('Wrong day, no message sent.');
//   };
// }

// checkAndSend();

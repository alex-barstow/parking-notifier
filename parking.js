const dotenv = require('dotenv').config();
const twilio = require('twilio');
const client = twilio(process.env.accountSID, process.env.authToken);

// 1st and 3rd Tuesdays - Park on even side
// 2nd and 4th Wednesdays - Park on odd side

const phoneNumbers = [
  // phone numbers formatted as '+15555555555'
]

function getNthDays(date, dayOfWeek) {
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

function sendReminders(message) {
  if (message.length < 100) {
    phoneNumbers.forEach((number) => {
      client.sendMessage({
        to: number,
        from: '+15082834493',
        body: message
      })
      console.log(`Sent to "${number}"`);
    })
    console.log(`Message: "${message}"`);
  }
}

function checkAndSend() {
  const now = new Date();
  const mondays = getNthDays(now, 1);
  const tuesdays = getNthDays(now, 2);

  if (now.getDate() === mondays[0].getDate() || now.getDate() === mondays[2].getDate()) {
    sendReminders('Street Sweeping tonight! Park on the OTHER side.');
  } else if (now.getDate() === tuesdays[1].getDate() || now.getDate() === tuesdays[3].getDate()) {
    sendReminders('Street Sweeping tonight! Park on OUR side.');
  } else {
    console.log('Wrong day, no message sent.');
  }
}

checkAndSend();

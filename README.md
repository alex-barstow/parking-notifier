# parking-notifier
A node script for sending out scheduled text message reminders to me and my friends to park on a certain side of the street for street sweeping. ($50 dollar fines!)

The script utilizes the [Twilio Programmable SMS API](https://www.twilio.com/sms) and is executed as a daily cron task on my Raspberry Pi. It's intended to be able to accommodate multiple households, each with their own unique reminder schedule. Currently, adding a new household to the script requires the manual labor of writing the functions that return true on 'reminder days', but I plan on simplifying this.

### Schedules
The exact dates for street sweeping vary from month to month, but do follow day-of-the-week schedules (ex. "the first Monday and Tuesday of the month", "the second and fourth Wednesday of the month," etc). Reminders are sent out the day before street sweeping days in order to avoid any tickets the mornings of.

### `households` object
This object contains all information about each household that is to receive text message reminders, including:
* the phone number of each occupant
* functions that return true on days before street sweeping days, when occupants should park on a particular side of the street
* the message content for each individual reminder

Adding a new household to this object is all that is needed for its occupants to start receiving text message reminders.

### Package for Pi
Running `npm run build` copies `package.json` and all files in the `src` directory to the `parking-notifier-build` directory, which can be easily sent to my pi. Currently, the destination directory needs to exist before running this command.

**Note:** `parking.js` requires a `privateVars.js` module (also in the `src` directory) that contains the Twilio credentials and the phone numbers for each member of every household:
```js
module.exports = {
  accountSID: /* Twilio Account SID */,
  authToken: /* Twilio Auth Token */,
  jane: /* phone number in the format '+15555555555' */,
  john: /* phone number in the format '+15555555555' */,
  /* all the numbers from every household */
};
```
### Testing
Run `npm run test` to run all tests in the `test` directory. There are some tests now but more are needed.

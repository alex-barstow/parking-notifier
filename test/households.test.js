// Simplified households object for testing
module.exports.testHouseholds = {
  wallaceStreet: {
    numbers: [
      '+15555555555',
      '+16666666666'
    ],
    reminders: {
      firstAndThirdTuesday: {
        condition: function() {
          return true;
        },
        message: 'Street Sweeping tonight! Park on the OTHER side.'
      },
      secondAndFourthWednesday: {
        condition: function() {
          return false;
        },
        message: 'Street Sweeping tonight! Park on OUR side.'
      }
    }
  },
  harvardStreet: {
    numbers: [
      '+14444444444'
    ],
    reminders: {
      firstMonday: {
        condition: function() {
          return false;
        },
        message: 'Street Sweeping tonight! Park on OUR side.'
      },
      firstTuesday: {
        condition: function() {
          return true;
        },
        message: 'Street Sweeping tonight! Park on the OTHER side.'
      }
    }
  }
};

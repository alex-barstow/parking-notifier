// 'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const parking = require('../src/parking');
const pry = require('pryjs');


describe('getNthDays()', function() {
  it('should return an array of dates', function() {
    const date = new Date();
    const dayOfWeek = 1;
    const dateArray = parking.getNthDays(date, dayOfWeek);

    expect(dateArray).to.be.an('array');
    expect(dateArray[0]).to.be.a('date');
  });

  it('should return dates with the same day as the provided dayOfWeek', function() {
    const date = new Date();
    const dayOfWeek = 1;
    const dateArray = parking.getNthDays(date, dayOfWeek);

    dateArray.forEach(date => {
      expect(date.getDay()).to.equal(dayOfWeek);
    });
  });

  it('should return dates in the month of the provided date', function() {
    const providedDate = new Date();
    const dayOfWeek = 1;
    const dateArray = parking.getNthDays(providedDate, dayOfWeek);

    dateArray.forEach(date => {
      expect(date.getMonth()).to.equal(providedDate.getMonth());
    });
  });

  it('should return Mondays for 1', function() {
    const providedDate = new Date();
    const dateArray = parking.getNthDays(providedDate, 1);

    dateArray.forEach(date => {
      expect(date.toDateString()).to.contain('Mon');
    });
  });

  it('should return Sundays for 0', function() {
    const providedDate = new Date();
    const dateArray = parking.getNthDays(providedDate, 0);

    dateArray.forEach(date => {
      expect(date.toDateString()).to.contain('Sun');
    });
  });
});

describe('dayBefore()', function() {
  it('should return a date', function() {
    const date = new Date();
    const dayBefore = parking.dayBefore(date);

    expect(dayBefore).to.be.a('date');
  });

  it('should return the day before the provided date', function() {
    const date = new Date();
    const dateClone = new Date(date.getTime());
    const dayBefore = parking.dayBefore(dateClone);

    date.setDate(date.getDate() - 1);

    expect(date.toString()).to.equal(dayBefore.toString());
  });

  it('should handle cases where the previous day is not in the same month', function() {
    const day = new Date('December 1, 2016 03:24:00');
    const previousDay = new Date('November 30, 2016 03:24:00');

    expect(parking.dayBefore(day).toString())
      .to.equal(previousDay.toString());
  });
});

describe('dayAfter()', function() {
  it('should return a date', function() {
    const date = new Date();
    const dayBefore = parking.dayBefore(date);

    expect(dayBefore).to.be.a('date');
  });

  it('should return the day after the provided date', function() {
    const date = new Date();
    const dateClone = new Date(date.getTime());
    const dayAfter = parking.dayAfter(dateClone);

    date.setDate(date.getDate() + 1);

    expect(date.toString()).to.equal(dayAfter.toString());
  });

  it('should handle cases where the next day is in the next month', function() {
    const day = new Date('November 30, 2016 03:24:00');
    const nextDay = new Date('December 1, 2016 03:24:00');

    expect(parking.dayAfter(day).toString())
      .to.equal(nextDay.toString());
  });
});

// Ensure that the reminder conditions are true a day before the day(s) in their name
// Use May, 2017 for test
describe('household reminder condition functions:', function() {
  context('firstAndThirdTuesday()', function() {
    const firstAndThirdTuesday = parking.households.wallaceStreet
      .reminders.firstAndThirdTuesday;

    it('should return true on the correct days', function() {

      // Monday, May 1
      const mayFirst = sinon.useFakeTimers(new Date('2017-05-02T01:41:07.511Z').getTime());

      expect(firstAndThirdTuesday.condition()).to.be.true;

      mayFirst.restore();

      // Monday, May 15
      const mayFifteen = sinon.useFakeTimers(new Date('2017-05-16T01:41:07.511Z').getTime());

      expect(firstAndThirdTuesday.condition()).to.be.true;

      mayFifteen.restore();
    });

    it('should return false on the wrong days', function() {

      // Tuesday, May 2
      const maySecond = sinon.useFakeTimers(new Date('2017-05-03T01:41:07.511Z').getTime());

      expect(firstAndThirdTuesday.condition()).to.be.false;

      maySecond.restore();

      // Sunday, April 30
      const aprilThirty = sinon.useFakeTimers(new Date('2017-05-01T01:41:07.511Z').getTime());

      expect(firstAndThirdTuesday.condition()).to.be.false;

      aprilThirty.restore();

      // Monday, May 8
      const mayEight = sinon.useFakeTimers(new Date('2017-05-09T01:41:07.511Z').getTime());

      expect(firstAndThirdTuesday.condition()).to.be.false;

      mayEight.restore();
    });
  });

  context('secondAndFourthWednesday()', function() {
    const secondAndFourthWednesday = parking.households.wallaceStreet
      .reminders.secondAndFourthWednesday;

    it('should return true on the correct days', function() {

      // Tuesday, May 9
      const mayNine = sinon.useFakeTimers(new Date('2017-05-10T01:41:07.511Z').getTime());

      expect(secondAndFourthWednesday.condition()).to.be.true;

      mayNine.restore();

      // Tuesday, May 23
      const mayTwentyThree = sinon.useFakeTimers(new Date('2017-05-24T01:41:07.511Z').getTime());

      expect(secondAndFourthWednesday.condition()).to.be.true;

      mayTwentyThree.restore();
    });

    it('should return false on the wrong days', function() {

      // Wednesday, May 10
      const mayTenth = sinon.useFakeTimers(new Date('2017-05-11T01:41:07.511Z').getTime());

      expect(secondAndFourthWednesday.condition()).to.be.false;

      mayTenth.restore();

      // Monday May 8
      const mayEigth = sinon.useFakeTimers(new Date('2017-05-09T01:41:07.511Z').getTime());

      expect(secondAndFourthWednesday.condition()).to.be.false;

      mayEigth.restore();

      // Tuesday May 16
      const maySixteen = sinon.useFakeTimers(new Date('2017-05-17T01:41:07.511Z').getTime());

      expect(secondAndFourthWednesday.condition()).to.be.false;

      maySixteen.restore();
    });
  });

  // test is good, uncovered bug
  context('firstMonday()', function() {
    const firstMonday = parking.households.harvardStreet.reminders.firstMonday;

    it('should return true on the correct day', function() {

      // Sunday, April 30
      const aprilThirty = sinon.useFakeTimers(new Date('2017-05-01T01:41:07.511Z').getTime());

      expect(firstMonday.condition()).to.be.true;

      aprilThirty.restore();
    });

    it('should return false on the wrong day', function() {

      // Monday, May 1
      const mayFirst = sinon.useFakeTimers(new Date('2017-05-02T01:41:07.511Z').getTime());

      expect(firstMonday.condition()).to.be.false;

      mayFirst.restore();
    });
  });

  context('firstTuesday()', function() {
    const firstTuesday = parking.households.harvardStreet
      .reminders.firstTuesday;

    it('should return true on the correct day', function() {

      // Monday, May 1
      const mayFirst = sinon.useFakeTimers(new Date('2017-05-02T01:41:07.511Z').getTime());

      expect(firstTuesday.condition()).to.be.true;

      mayFirst.restore();
    });

    it('should return false on the wrong day', function() {
      // Tuesday, May 2
      const maySecond = sinon.useFakeTimers(new Date('2017-05-03T01:41:07.511Z').getTime());

      expect(firstTuesday.condition()).to.be.false;

      maySecond.restore();
    });
  });
});

// use sinon spy here to see how many times sendBatch() is called
// describe('checkAndSend()', function() {
//   sinon.stub(parking, "sendBatch", function() {
//     return new Promise(function(resolve, reject) {
//       resolve();
//     });
//   });
//
//   it('should not send any reminders on a day where no condition is true', function() {
//
//     // no reminder should be sent on the first Sat
//     const maySixth = sinon.useFakeTimers(new Date('2017-05-02T01:41:07.511Z').getTime());
//
//     return parking.checkAndSend(parking.households)
//       .then(() => {
//         return expect(spy.callCount).to.equal(0);
//       });
//
//     maySixth.restore();
//   });
//
//   it('should send as many reminder batches as there are true conditions', function() {
//
//     // May 1 was the day before the first Tuesday. 2 reminder batches should be sent.
//     const mayFirst = sinon.useFakeTimers(new Date('2017-05-02T01:41:07.511Z').getTime());
//
//     return parking.checkAndSend(parking.households)
//       .then(() => {
//         return expect(spy.callCount).to.equal(5);
//       });
//
//     mayFirst.restore();
//   });
//
//   it(`should only send reminders to those numbers
//       in a household with a condition that returns true`, function() {
//
//   });
// });

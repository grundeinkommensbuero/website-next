import * as dsm from './dateStringManipulation';

const germanWeekdays = [
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag',
  'Sonntag',
];

describe('Date-String manipulation Utils', () => {
  it('returns a dates name of the weekday', () => {
    // Arrange & Act
    const today = dsm.getDayName(new Date());
    // Assert
    const checkName = germanWeekdays.includes(today);
    expect(checkName).toBe(true);
  });

  it('knows if a date is today or tomorrow', () => {
    // Arrange
    const baseDate = new Date();
    const dateToday = new Date(
      baseDate.getFullYear(),
      baseDate.getMonth(),
      baseDate.getDate(),
      baseDate.getHours(),
      baseDate.getMinutes() + 1
    );
    const dateTomorrow = new Date(
      baseDate.getFullYear(),
      baseDate.getMonth(),
      baseDate.getDate() + 1
    );
    const dateOtherDay = new Date(
      baseDate.getFullYear(),
      baseDate.getMonth(),
      baseDate.getDate() + 20
    );

    // Act
    const todayDateToday = dsm.checkIfDateIsToday(dateToday);
    const todayDateTomorrow = dsm.checkIfDateIsToday(dateTomorrow);
    const tomorrowDateToday = dsm.checkIfDateIsTomorrow(dateToday);
    const tomorrowDateTomorrow = dsm.checkIfDateIsTomorrow(dateTomorrow);
    const otherDayDateToday = dsm.checkIfDateIsToday(dateOtherDay);
    const otherDayDateTomorrow = dsm.checkIfDateIsTomorrow(dateOtherDay);

    // Assert
    expect(todayDateToday).toBe(true);
    expect(todayDateTomorrow).toBe(false);
    expect(tomorrowDateToday).toBe(false);
    expect(tomorrowDateTomorrow).toBe(true);
    expect(otherDayDateToday).toBe(false);
    expect(otherDayDateTomorrow).toBe(false);
  });

  it('matches german date format', () => {
    // Arrange
    const dateRegEx =
      /^\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})\s*$/;
    // Act
    const date = dsm.getGermanDateFormat(new Date());
    // Assert
    expect(date).toMatch(dateRegEx);
  });

  it('gets day and month from date', () => {
    // Arrange
    const baseDate = new Date();
    const expectedString = `${baseDate.getDate()}.${baseDate.getMonth() + 1}.`;
    // Act
    const received = dsm.getDayWithMonth(new Date());
    // Assert
    expect(received).toBe(expectedString);
  });
});

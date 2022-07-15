export const GER_LOCALE = 'de-DE';

export const getGermanDateFormat = date => {
  return new Date(date).toLocaleDateString(GER_LOCALE);
};

export const getDateWithWeekday = date => {
  const isToday = checkIfDateIsToday(date);
  if (isToday) return 'Heute';

  const isTomorrow = checkIfDateIsTomorrow(date);
  if (isTomorrow) return 'Morgen';

  const otherDay = `${getDayName(new Date(date))}, ${getDayWithMonth(date)}`;
  return otherDay;
};

export const getDayName = dateStr => {
  var date = new Date(dateStr);
  return date.toLocaleDateString(GER_LOCALE, { weekday: 'long' });
};

export const localeTime = date => {
  return new Date(date).toLocaleTimeString(GER_LOCALE, {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getDayWithMonth = date => {
  const dateString = getGermanDateFormat(new Date(date)).split('.');
  return `${dateString[0]}.${dateString[1]}.`;
};

export const checkIfDateIsToday = date => {
  if (checkIfInRangeOfDaysX(date, 0)) {
    return true;
  }
  return false;
};

export const checkIfDateIsTomorrow = date => {
  if (checkIfInRangeOfDaysX(date, 1)) {
    return true;
  }
  return false;
};

export const checkIfInRangeOfDaysX = (dateStr, num) => {
  const date = new Date(dateStr);
  const dateToCheck = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const dateToday = new Date();
  const dateToCompare = new Date(
    dateToday.getFullYear(),
    dateToday.getMonth(),
    dateToday.getDate() + num
  );
  if (
    dateToCheck.getFullYear() === dateToCompare.getFullYear() &&
    dateToCheck.getMonth() === dateToCompare.getMonth() &&
    dateToCheck.getDate() === dateToCompare.getDate()
  ) {
    return true;
  }
  return false;
};

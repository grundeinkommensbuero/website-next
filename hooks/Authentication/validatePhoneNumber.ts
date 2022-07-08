export const validatePhoneNumber = (phoneNumber: string) => {
  if (phoneNumber.length < 6) {
    return false;
  }

  const regex = /^[0-9]*$/g;
  return regex.test(phoneNumber);
};

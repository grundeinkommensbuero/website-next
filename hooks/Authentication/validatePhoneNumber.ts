export const validatePhoneNumber = (phoneNumber: string) => {
  const regex = /^[0-9]*$/g;
  return regex.test(phoneNumber);
};

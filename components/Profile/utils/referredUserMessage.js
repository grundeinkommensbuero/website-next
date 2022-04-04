export const getReferredUserMessage = ({ userData }) => {
  if (userData && userData.referredUsers) {
    if (userData.referredUsers.length === 1) {
      return `Dank dir hat sich ein*e weitere*r User*in angemeldet!`;
    } else {
      return `Dank dir haben sich ${userData.referredUsers.length} weitere User*innen angemeldet!`;
    }
  }
  return null;
};

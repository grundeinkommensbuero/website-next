export const getCustomNewsletterEnumeration = ({ userData }) => {
  const newsletterLabels = [];
  if (userData?.newsletterConsent && userData?.customNewsletters) {
    // If general newsletter consent is true, add it to the list
    userData.newsletterConsent.value &&
      newsletterLabels.push('Expeditions-Letter');
    // Add the name of each custom newsletter
    userData.customNewsletters.forEach(n => {
      n.value && newsletterLabels.push(n.name);
    });
  }
  return [
    newsletterLabels.slice(0, -1).join(', '),
    newsletterLabels.slice(-1)[0],
  ].join(newsletterLabels.length < 2 ? '' : ' und ');
};

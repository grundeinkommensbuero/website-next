import { LinkButtonLocal } from '../Forms/Button';
import { SectionWrapper } from '../Section/SectionWrapper';

const IS_BERLIN_PROJECT = process.env.NEXT_PUBLIC_PROJECT === 'Berlin';
const IS_HAMBURG_PROJECT = process.env.NEXT_PUBLIC_PROJECT === 'Hamburg';

const NotFound = () => {
  return (
    <SectionWrapper
      colorScheme={
        IS_BERLIN_PROJECT
          ? 'colorSchemeRoseOnWhite'
          : IS_HAMBURG_PROJECT
          ? 'colorSchemeHamburg'
          : 'colorSchemeWhite'
      }
    >
      <div className="text-center">
        <h2 className="mt-16 mb-4">Diese Seite gibt es leider nicht.</h2>
        <LinkButtonLocal href="/" className="my-4">
          Zurück zur Startseite
        </LinkButtonLocal>
      </div>
    </SectionWrapper>
  );
};

export default NotFound;

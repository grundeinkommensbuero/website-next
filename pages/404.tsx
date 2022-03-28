import Link from 'next/link';

const PageNotFound = () => {
  return (
    <div className="text-center">
      <h2 className="mt-16 mb-4 text-violet">
        Diese Seite gibt es leider nicht.
      </h2>
      <Link href="/">
        <a className="text-d-xl" aria-label="Zurück zur Startseite">
          Zurück zur Startseite
        </a>
      </Link>
    </div>
  );
};

export default PageNotFound;

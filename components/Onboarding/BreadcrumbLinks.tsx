import React, { SetStateAction } from 'react';
import menuElements from './BreadcrumbMenu.json';
import cN from 'classnames';
import s from './style.module.scss';

type BreadcrumbLinksProps = {
  setCurrentElement: React.Dispatch<SetStateAction<string>>;
  currentElement: string;
};

export const BreadcrumbLinks = ({
  setCurrentElement,
  currentElement,
}: BreadcrumbLinksProps) => {
  const pathMatchesMenuElement = (element: string) => {
    return currentElement === element;
  };

  return (
    <>
      {menuElements.map(element => {
        return (
          <button
            aria-label="Schließen"
            onClick={() => setCurrentElement(element.name)}
            key={element.name}
            className={cN(s.breadcrumbElement, {
              [s.breadcrumbElementActive]: pathMatchesMenuElement(element.name),
            })}
          >
            {element.title}
          </button>
        );
      })}
    </>
  );
};

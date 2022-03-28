import React from 'react';
import menuElements from './BreadcrumbMenu.json';
import cN from 'classnames';
import * as s from './style.module.less';

export const BreadcrumbLinks = ({ setCurrentElement, currentElement }) => {
  const pathMatchesMenuElement = element => {
    return currentElement === element;
  };

  return menuElements.map(element => {
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
  });
};

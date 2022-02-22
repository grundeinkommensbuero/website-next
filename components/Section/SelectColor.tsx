import React from 'react';
import { ColorScheme } from '.';
import s from './style.module.scss';
import cN from 'classnames';

type Option = {
  value: ColorScheme;
  label: string;
};

const options: Option[] = [
  { value: 'colorSchemeAqua', label: 'Aqua' },
  { value: 'colorSchemeViolet', label: 'Violet' },
  { value: 'colorSchemeWhite', label: 'White' },
  { value: 'colorSchemeRed', label: 'Red' },
];

export const SelectColor = ({
  currentColorScheme,
  updateColorScheme,
}: {
  currentColorScheme: string;
  updateColorScheme: (color: ColorScheme) => void;
}) => (
  <div className={s.dropdown}>
    <div className="flex">
      <div className={cN(s.themePreview, currentColorScheme, 'mr-2')} />
      <span>Farbschema</span>
    </div>
    <div className={s.dropdownContent}>
      {options.map(option => {
        return (
          <section key={option.value} className={option.value}>
            <button
              className={cN('noStyleButton', s.optionButton)}
              onClick={() => updateColorScheme(option.value)}
            >
              {option.label}
            </button>
          </section>
        );
      })}
    </div>
  </div>
);

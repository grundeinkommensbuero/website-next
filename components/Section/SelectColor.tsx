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
  updateColorScheme,
}: {
  updateColorScheme: (color: ColorScheme) => void;
}) => (
  <div className={s.dropdown}>
    <span>Farbschema</span>
    <div className={s.dropdownContent}>
      {options.map(option => {
        return (
          <button
            className={cN('noStyleButton', s.optionButton)}
            key={option.value}
            onClick={() => updateColorScheme(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  </div>
);

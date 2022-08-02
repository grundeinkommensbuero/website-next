import React from 'react';
import { ColorScheme } from '.';
import s from './style.module.scss';
import cN from 'classnames';

type Option = {
  value: ColorScheme;
  label: string;
  fontColor: string;
};

const options: Option[] = [
  { value: 'colorSchemeAqua', label: 'Aqua', fontColor: 'text-white' },
  { value: 'colorSchemeViolet', label: 'Violet', fontColor: 'text-white' },
  { value: 'colorSchemeWhite', label: 'White', fontColor: 'text-black' },
  { value: 'colorSchemeRed', label: 'Red', fontColor: 'text-white' },
  { value: 'colorSchemeRose', label: 'Rose', fontColor: 'text-black' },
  {
    value: 'colorSchemeRoseOnWhite',
    label: 'Rose on white',
    fontColor: 'text-black',
  },
];

export const SelectColor = ({
  currentColorScheme,
  updateColorScheme,
}: {
  currentColorScheme: string;
  updateColorScheme: (color: ColorScheme) => void;
}) => (
  <div className={cN(s.dropdown, 'm-2')}>
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
              <b className={cN(option.fontColor, 'text-lg')}>{option.label}</b>
            </button>
          </section>
        );
      })}
    </div>
  </div>
);

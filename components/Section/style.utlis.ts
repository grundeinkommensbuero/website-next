import s from './style.module.scss';

export const getLeftLayout = (layout: string): string => {
  switch (layout) {
    case '100':
      return s.flexItem100;
    case '50-50':
      return s.flexItem50;
    case '25-75':
      return s.flexItem25;
    case '75-25':
      return s.flexItem75;
    default:
      return s.flexItem100;
  }
};

export const getRightLayout = (layout: string): string => {
  switch (layout) {
    case '100':
      return s.flexItem100;
    case '50-50':
      return s.flexItem50;
    case '25-75':
      return s.flexItem75;
    case '75-25':
      return s.flexItem25;
    default:
      return s.flexItem100;
  }
};

export const getOverrideLayout = (override: string): string | null => {
  switch (override) {
    case '100':
      return s.flexItem100;
    case '75':
      return s.flexItem75;
    case '50':
      return s.flexItem50;
    case '25':
      return s.flexItem25;
    default:
      return null;
  }
};

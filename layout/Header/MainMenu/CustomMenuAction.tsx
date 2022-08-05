import { ReactElement } from 'react';
import s from './style.module.scss';

export type CustomActionEntry = {
  action: () => void;
  label: string;
};

type CustomMenuActionProps = {
  entry: CustomActionEntry;
};

export const CustomMenuAction = ({
  entry,
}: CustomMenuActionProps): ReactElement => {
  return (
    <button
      className={`${s.button} mx-2 nowrap hoverUnderline`}
      aria-label={entry.label}
      onClick={() => entry.action()}
    >
      {entry.label}
    </button>
  );
};

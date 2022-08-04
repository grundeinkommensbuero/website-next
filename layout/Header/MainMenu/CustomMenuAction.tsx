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
      className={`mx-2 text-xl nowrap cursor-pointer hoverUnderline ${s.button}`}
      aria-label={entry.label}
      onClick={() => entry.action()}
    >
      {entry.label}
    </button>
  );
};

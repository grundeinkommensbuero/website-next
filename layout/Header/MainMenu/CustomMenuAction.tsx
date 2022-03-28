import { ReactElement } from 'react';

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
    <a
      className={`mx-2 text-xl nowrap cursor-pointer hoverUnderline`}
      aria-label={entry.label}
      onClick={() => entry.action()}
    >
      {entry.label}
    </a>
  );
};

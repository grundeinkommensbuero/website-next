import { ReactElement, useState } from 'react';
import { NoSsr } from '../Utils/NoSsr';
import { Icon } from '@mdi/react';

type IconColors = 'gray' | '#46b4b4';

type EditIconProps = {
  path: string;
  action: () => void;
  flipVertical?: boolean;
  flipHorizontal?: boolean;
  rotate?: number;
  size?: number;
  title?: string;
  tooltip?: string;
};

export const EditIcon = ({
  path,
  action,
  flipHorizontal,
  flipVertical,
  rotate,
  size = 1,
  title,
  tooltip,
}: EditIconProps): ReactElement => {
  const [color, setColor] = useState<IconColors>('gray');

  return (
    <button
      className="noStyleButton"
      onClick={() => action()}
      onMouseEnter={() => setColor('#46b4b4')}
      onMouseLeave={() => setColor('gray')}
    >
      <NoSsr>
        <Icon
          path={path}
          size={size}
          horizontal={flipHorizontal}
          vertical={flipVertical}
          rotate={rotate}
          color={color}
          title={title}
          data-tip={tooltip}
        />
      </NoSsr>
    </button>
  );
};

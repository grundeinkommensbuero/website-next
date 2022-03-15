import { ReactElement, useState } from 'react';
import { NoSsr } from '../Util/NoSsr';
import { Icon } from '@mdi/react';

type EditIconProps = {
  path: string;
  action: () => void;
  flipVertical?: boolean;
  flipHorizontal?: boolean;
  rotate?: number;
  size?: number;
  title?: string;
  tooltip?: string;
  isActive?: boolean;
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
  isActive = false,
}: EditIconProps): ReactElement => {
  const [hover, setHover] = useState<boolean>(false);

  const getColor = () => {
    if (!hover) {
      return isActive ? '#7d69f6' : 'gray';
    }
    return '#46b4b4';
  };

  return (
    <button
      className="noStyleButton"
      onClick={() => action()}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <NoSsr>
        <Icon
          path={path}
          size={size}
          horizontal={flipHorizontal}
          vertical={flipVertical}
          rotate={rotate}
          color={getColor()}
          title={title}
          data-tip={tooltip}
        />
      </NoSsr>
    </button>
  );
};

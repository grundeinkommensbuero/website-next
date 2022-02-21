import { ReactElement } from 'react';
import s from './style.module.scss';
import { Icon } from '@mdi/react';
import { SelectColor } from './SelectColor';
import { Layout, ColorScheme, Section } from '.';
import ReactTooltip from 'react-tooltip';
import {
  mdiPageLayoutHeader,
  mdiPageLayoutHeaderFooter,
  mdiDockLeft,
  mdiTablet,
} from '@mdi/js';

type EditSectionProps = {
  modifiedSection: Section;
  setModifiedSection: (section: Section) => void;
};

export const EditSection = ({
  modifiedSection,
  setModifiedSection,
}: EditSectionProps): ReactElement => {
  const updateSectionLayout = (layout: Layout): void => {
    const updated = {
      ...modifiedSection,
      layout,
    };
    setModifiedSection(updated);
  };

  const updateColorScheme = (colorScheme: ColorScheme): void => {
    const updated = {
      ...modifiedSection,
      colorScheme,
    };
    setModifiedSection(updated);
  };

  return (
    <>
      <ReactTooltip backgroundColor='black' />

      <div className={s.editSection}>
        <div className='sections flex'>
          <button
            className='noStyleButton'
            onClick={() => updateSectionLayout('25-75')}>
            <Icon
              path={mdiDockLeft}
              title='Layout 25-75'
              size={1.25}
              horizontal
              vertical
              rotate={180}
              color='gray'
              data-tip='Layout 25%-75%'
            />
          </button>

          <button
            className='noStyleButton'
            onClick={() => updateSectionLayout('50-50')}>
            <Icon
              path={mdiPageLayoutHeaderFooter}
              title='Layout 50-50'
              size={1.25}
              horizontal
              vertical
              rotate={90}
              color='gray'
              data-tip='Layout 50%-50%'
            />
          </button>

          <button
            className='noStyleButton'
            onClick={() => updateSectionLayout('75-25')}>
            <Icon
              path={mdiPageLayoutHeader}
              title='Layout 75-25'
              size={1.25}
              horizontal
              vertical
              rotate={-90}
              color='gray'
              data-tip='Layout 75%-25%'
            />
          </button>

          <button
            className='noStyleButton'
            onClick={() => updateSectionLayout('100')}>
            <Icon
              path={mdiTablet}
              title='Layout 100'
              size={1.25}
              horizontal
              vertical
              rotate={0}
              color='gray'
              data-tip='Layout 100%'
            />
          </button>

          <SelectColor updateColorScheme={updateColorScheme} />
        </div>
      </div>
    </>
  );
};

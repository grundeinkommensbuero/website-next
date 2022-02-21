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
  mdiContentSaveOutline,
} from '@mdi/js';
import { updateSection } from '../../directus/sdk/updateSection';
import { NoSsr } from '../Utils/NoSsr';

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
      <NoSsr>
        <ReactTooltip backgroundColor='black' />
      </NoSsr>

      <div className={s.editSection}>
        <div className='sections flex'>
          <button
            className='noStyleButton'
            onClick={() => updateSectionLayout('25-75')}>
            <NoSsr>
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
            </NoSsr>
          </button>

          <button
            className='noStyleButton'
            onClick={() => updateSectionLayout('50-50')}>
            <NoSsr>
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
            </NoSsr>
          </button>

          <button
            className='noStyleButton'
            onClick={() => updateSectionLayout('75-25')}>
            <NoSsr>
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
            </NoSsr>
          </button>

          <button
            className='noStyleButton'
            onClick={() => updateSectionLayout('100')}>
            <NoSsr>
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
            </NoSsr>
          </button>

          <SelectColor updateColorScheme={updateColorScheme} />

          <div className='grow' />

          <button
            className='noStyleButton'
            onClick={() => updateSection(modifiedSection)}>
            <NoSsr>
              <Icon
                path={mdiContentSaveOutline}
                title='Speichern'
                size={1.25}
                rotate={0}
                color='gray'
                data-tip='Speichern'
              />
            </NoSsr>
          </button>
        </div>
      </div>
    </>
  );
};

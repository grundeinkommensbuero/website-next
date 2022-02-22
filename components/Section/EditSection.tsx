import { ReactElement } from 'react';
import s from './style.module.scss';
import { SelectColor } from './SelectColor';
import { Layout, ColorScheme, Section } from '.';
import {
  mdiPageLayoutHeader,
  mdiPageLayoutHeaderFooter,
  mdiDockLeft,
  mdiTablet,
  mdiContentSaveOutline,
} from '@mdi/js';
import { updateSection } from '../../directus/sdk/updateSection';
import { EditIcon } from './EditIcon';

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
      <div className={s.editSection}>
        <div className="sections flex">
          <EditIcon
            path={mdiDockLeft}
            action={() => updateSectionLayout('25-75')}
            size={1.25}
            tooltip="Layout 25%-75%"
          />

          <EditIcon
            path={mdiPageLayoutHeaderFooter}
            action={() => updateSectionLayout('50-50')}
            size={1.25}
            rotate={90}
            tooltip="Layout 50%-50%"
          />

          <EditIcon
            path={mdiPageLayoutHeader}
            action={() => updateSectionLayout('75-25')}
            size={1.25}
            rotate={90}
            tooltip="Layout 75%-25%"
          />

          <EditIcon
            path={mdiTablet}
            action={() => updateSectionLayout('100')}
            size={1.25}
            rotate={0}
            tooltip="Layout 100%"
          />

          <SelectColor updateColorScheme={updateColorScheme} />

          <div className="grow" />

          <EditIcon
            path={mdiContentSaveOutline}
            action={() => updateSection(modifiedSection)}
            size={1.25}
            rotate={0}
            tooltip="Speichern"
          />
        </div>
      </div>
    </>
  );
};

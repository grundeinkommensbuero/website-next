import { ReactElement, useContext } from 'react';
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
import { updateSection } from './updateSection';
import { EditIcon } from './EditIcon';
import AuthContext from '../../context/Authentication';

type EditSectionProps = {
  modifiedSection: Section;
  setModifiedSection: (section: Section) => void;
  currentColorScheme: string;
};

export const EditSection = ({
  modifiedSection,
  setModifiedSection,
  currentColorScheme,
}: EditSectionProps): ReactElement => {
  const { customUserData } = useContext(AuthContext);

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
          <SelectColor
            currentColorScheme={currentColorScheme}
            updateColorScheme={updateColorScheme}
          />

          <div className="grow" />

          <EditIcon
            path={mdiContentSaveOutline}
            action={() => {
              // Close open text editors
              const closedEditors = {
                ...modifiedSection,
                render: modifiedSection.render.map(element => {
                  if (element.collection === 'sectionsText') {
                    element.edit = false;
                  }
                  return element;
                }),
              };
              setModifiedSection(closedEditors);
              // Save section to directus
              if (customUserData?.directus?.token)
                updateSection(modifiedSection, customUserData.directus.token);
            }}
            size={1.25}
            rotate={0}
            tooltip="Speichern"
          />
        </div>
      </div>
    </>
  );
};

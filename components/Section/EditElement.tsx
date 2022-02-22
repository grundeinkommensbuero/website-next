import { ReactElement } from 'react';
import { OverrideLayout, Section, Element } from '.';
import { EditIcon } from './EditIcon';

import s from './style.module.scss';

import {
  mdiPageLayoutHeader,
  mdiPageLayoutHeaderFooter,
  mdiDockLeft,
  mdiTablet,
  mdiBackspaceOutline,
  mdiPlaylistEdit,
} from '@mdi/js';

type EditElementProps = {
  modifiedSection: Section;
  setModifiedSection: (section: Section) => void;
  index: number;
  element: Element;
};

export const EditElement = ({
  modifiedSection,
  setModifiedSection,
  index,
  element,
}: EditElementProps): ReactElement => {
  const updateElementLayout = (
    overrideLayout: OverrideLayout,
    index: number
  ): void => {
    // Get and update the edited element
    const updatedElement: Element = {
      ...modifiedSection.render[index],
      overrideLayout,
    };
    // Replace it in render list
    const updatedRender = modifiedSection.render.map((element, elIndex) => {
      if (elIndex === index) {
        return updatedElement;
      }
      return element;
    });
    // Update renderlist in section
    const updated = {
      ...modifiedSection,
      render: updatedRender,
    };
    setModifiedSection(updated);
  };

  const editElement = (edit: boolean, index: number): void => {
    // Get and update the edited element
    const updatedElement: Element = {
      ...modifiedSection.render[index],
      edit,
    };
    // Replace it in render list
    const updatedRender = modifiedSection.render.map((element, elIndex) => {
      if (elIndex === index) {
        return updatedElement;
      }
      return element;
    });
    // Update renderlist in section
    const updated = {
      ...modifiedSection,
      render: updatedRender,
    };
    setModifiedSection(updated);
  };

  return (
    <div className={s.editElement}>
      <EditIcon
        path={mdiDockLeft}
        action={() => updateElementLayout('25', index)}
        size={1.25}
        tooltip="Element Layout 25%"
      />

      <EditIcon
        path={mdiPageLayoutHeaderFooter}
        action={() => updateElementLayout('50', index)}
        size={1.25}
        rotate={90}
        tooltip="Element Layout 50%"
      />

      <EditIcon
        path={mdiPageLayoutHeader}
        action={() => updateElementLayout('75', index)}
        size={1.25}
        rotate={90}
        tooltip="Element Layout 75%"
      />

      <EditIcon
        path={mdiTablet}
        action={() => updateElementLayout('100', index)}
        size={1.25}
        rotate={0}
        tooltip="Element Layout 100%"
      />

      <EditIcon
        path={mdiBackspaceOutline}
        action={() => updateElementLayout(null, index)}
        size={1.25}
        rotate={0}
        tooltip="Element Layout entfernen"
      />

      {element.content && (
        <EditIcon
          path={mdiPlaylistEdit}
          action={() => editElement(element.edit ? false : true, index)}
          size={1.25}
          rotate={0}
          tooltip="Text bearbeiten"
        />
      )}
    </div>
  );
};

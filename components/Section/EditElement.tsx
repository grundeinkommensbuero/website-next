import { ReactElement } from 'react';
import { Section, SectionElement, SectionsText } from '.';
import { EditIcon } from './EditIcon';

import s from './style.module.scss';

import {
  mdiPageLayoutHeader,
  mdiPageLayoutHeaderFooter,
  mdiDockLeft,
  mdiDockRight,
  mdiTablet,
  mdiBackspaceOutline,
  mdiPlaylistEdit,
  mdiViewCompactOutline,
} from '@mdi/js';

import { NoSsr } from '../Util/NoSsr';
import ReactTooltip from 'react-tooltip';
import cN from 'classnames';
import { Column } from '../../utils/getPageProps';

type EditElementProps = {
  modifiedSection: Section;
  setModifiedSection: (section: Section) => void;
  element: SectionElement;
};

export const EditElement = ({
  modifiedSection,
  setModifiedSection,
  element,
}: EditElementProps): ReactElement => {
  const updateElementLayout = (column: Column, index: number): void => {
    // Get and update the edited element
    const updatedElement: SectionElement = {
      ...modifiedSection.render[index],
      column,
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
    const origElement = modifiedSection.render[index] as SectionsText;
    // Get and update the edited element
    const updatedElement: SectionsText = {
      ...origElement,
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
      <NoSsr>
        <ReactTooltip backgroundColor={'black'} />
      </NoSsr>

      {/* <EditIcon
        path={mdiDrag}
        action={() => console.log('DRAG!')}
        size={1.25}
        rotate={0}
        tooltip="Sortieren"
      /> */}

      <div className={s.dropdownEditRow}>
        <EditIcon
          path={mdiViewCompactOutline}
          action={() => {}}
          size={1.25}
          rotate={0}
          tooltip="Spalte auswählen"
          isActive={true}
        />
        <div className={cN(s.dropdownEditRowContent)}>
          <EditIcon
            path={mdiDockRight}
            action={() => updateElementLayout('left', element.index)}
            size={1.25}
            tooltip="Links"
            isActive={element.column === 'left'}
          />

          <EditIcon
            path={mdiDockRight}
            action={() => updateElementLayout('leftThird', element.index)}
            size={1.25}
            tooltip="Links drittel"
            isActive={element.column === 'leftThird'}
          />

          <EditIcon
            path={mdiTablet}
            action={() => updateElementLayout('centerWide', element.index)}
            size={1.25}
            tooltip="Mitte weit"
            isActive={element.column === 'centerWide'}
          />

          <EditIcon
            path={mdiPageLayoutHeaderFooter}
            action={() => updateElementLayout('centerNarrow', element.index)}
            size={1.25}
            rotate={90}
            tooltip="Mitte schmal"
            isActive={element.column === 'centerNarrow'}
          />

          <EditIcon
            path={mdiPageLayoutHeaderFooter}
            action={() => updateElementLayout('centerThird', element.index)}
            size={1.25}
            rotate={90}
            tooltip="Mitte drittel"
            isActive={element.column === 'centerThird'}
          />

          <EditIcon
            path={mdiDockLeft}
            action={() => updateElementLayout('right', element.index)}
            size={1.25}
            rotate={0}
            tooltip="Rechts"
            isActive={element.column === 'right'}
          />

          <EditIcon
            path={mdiDockLeft}
            action={() => updateElementLayout('rightThird', element.index)}
            size={1.25}
            rotate={0}
            tooltip="Rechts drittel"
            isActive={element.column === 'rightThird'}
          />
        </div>
      </div>

      {element.collection === 'sectionsText' && (
        <EditIcon
          path={mdiPlaylistEdit}
          action={() => editElement(element.edit ? false : true, element.index)}
          size={1.25}
          rotate={0}
          tooltip="Text bearbeiten"
        />
      )}
    </div>
  );
};

import { Dispatch, ReactElement, SetStateAction } from 'react';
import { EditElement } from './EditElement';
import { Section, SectionsText } from '.';
import parseHTML from 'html-react-parser';
import { Tiptap } from '../Editor/Tiptap';

type SectionsTextEditableProps = {
  element: SectionsText;
  modifiedSection: Section;
  isLoggedIn: boolean;
  updateContent: (index: number, content: string) => void;
  setModifiedSection: Dispatch<SetStateAction<Section>>;
};

export const SectionsTextEditable = ({
  element,
  modifiedSection,
  isLoggedIn,
  updateContent,
  setModifiedSection,
}: SectionsTextEditableProps): ReactElement => {
  return (
    <div>
      {isLoggedIn && (
        <EditElement
          modifiedSection={modifiedSection}
          setModifiedSection={setModifiedSection}
          element={element}
        />
      )}
      {!element.edit ? (
        <>{parseHTML(element.content)}</>
      ) : (
        <Tiptap
          content={element.content}
          updateContent={content => updateContent(element.index, content)}
        />
      )}
    </div>
  );
};

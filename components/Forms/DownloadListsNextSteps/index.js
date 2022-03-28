import React from 'react';
import { StepList, StepListItem } from '../../StepList';

export default ({ children }) => (
  <>
    <StepList>
      {children}
      <StepListItem icon="print">
        Drucke so viele Listen, wie du Unterschriften sammeln möchtest.
      </StepListItem>
      <StepListItem icon="stack">Sammel, so viel du kannst!</StepListItem>
      <StepListItem icon="send">
        Ab die Post: Schicke volle Listen immer möglichst bald los.
      </StepListItem>
    </StepList>
  </>
);

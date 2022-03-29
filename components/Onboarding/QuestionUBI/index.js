import React from 'react';
import gS from '../style.module.scss';

import { Textarea } from '../../Forms/TextInput';
import { Button } from '../../Forms/Button';
import { PageContainer } from '../PageContainer';

export const QuestionUBI = ({
  userData,
  compIndex,
  setCurrentElementByIndex,
}) => {
  return (
    <PageContainer>
      <h3 className={gS.moduleTitle}>Deine Frage ans Grundeinkommen</h3>
      <p className={gS.descriptionTextLarge}>
        Was erhoffst du dir vom Grundeinkommen? Welche Fragen soll der
        Modellversuch beantworten?
      </p>

      <Textarea
        className={gS.textArea}
        placeholder={'Erzähle uns, warum du das Grundeinkommen testen willst.'}
      />

      <div className={gS.fullWidthFlex}>
        <Button
          className={gS.nextButton}
          onClick={() => setCurrentElementByIndex(compIndex + 1)}
        >
          Weiter
        </Button>
      </div>
      <div className={gS.fullWidthFlex}>
        <span
          aria-hidden="true"
          className={gS.linkLikeFormatted}
          onClick={() => setCurrentElementByIndex(compIndex + 1)}
        >
          Jetzt nicht
        </span>
      </div>
    </PageContainer>
  );
};

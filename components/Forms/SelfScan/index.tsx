import React, { useState, useEffect, useContext, SetStateAction } from 'react';
import { Form, Field } from 'react-final-form';
import cN from 'classnames';
import querystring from 'query-string';

import {
  RequestState,
  useUpdateSignatureListByUser,
} from '../../../hooks/Api/Signatures/Update';
import { useSignatureCountOfUser } from '../../../hooks/Api/Signatures/Get';
import AuthContext from '../../../context/Authentication';
import { CTAButtonContainer, CTAButton } from '../CTAButton';

import SignatureStats from '../../SignatureStats';
import SignUp from '../SignUp';
import FormWrapper from '../FormWrapper';
import FormSection from '../FormSection';
import { FinallyMessage } from '../FinallyMessage';
import { TextInputWrapped } from '../TextInput';
import s from './style.module.scss';
import { validateEmail } from '../../../hooks/Authentication/validateEmail';

const IS_BERLIN_PROJECT = process.env.NEXT_PUBLIC_PROJECT === 'Berlin';

type SelfScanProps = { successMessage: string; className?: string };

const SelfScan = ({ successMessage, className }: SelfScanProps) => {
  const [state, updateSignatureList, resetSignatureListState] =
    useUpdateSignatureListByUser();
  const [signatureCountOfUser, getSignatureCountOfUser, resetSignatureCount] =
    useSignatureCountOfUser();

  // Updating a list should be possible via list id or user id
  const [listId, setListId] = useState<string>('');
  const [eMail, setEMail] = useState<string>('');

  const { userId } = useContext(AuthContext);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    // Will be null, if param does not exist
    const listIdFromParam = urlParams.get('listId');
    if (listIdFromParam) {
      setListId(listIdFromParam);
    }
  }, []);

  useEffect(() => {
    if (userId || eMail) {
      getSignatureCountOfUser({ userId: userId, email: eMail });
    }
    // eslint-disable-next-line
  }, [userId, eMail, state]);

  useEffect(() => {
    if (!userId) {
      resetSignatureCount();
    }
    // eslint-disable-next-line
  }, [userId]);

  const countSignaturesFormProps: CountSignatureFormProps = {
    state,
    updateSignatureList,
    listId,
    userId,
    eMail,
    setEMail,
    successMessage,
    count,
    setCount,
    setListId,
    resetSignatureListState,
  };

  return (
    <>
      {signatureCountOfUser && state !== 'userNotFound' && state !== 'error' ? (
        <div className={className}>
          <SignatureStats
            signatureCount={signatureCountOfUser}
            className={s.statisticsOverall}
          />
          <div className={s.visualisation}>
            <CountSignaturesForm {...countSignaturesFormProps} />
          </div>
        </div>
      ) : null}
    </>
  );
};

type CountSignatureFormProps = {
  state: RequestState;
  updateSignatureList: (data: any) => Promise<void>;
  listId: string;
  userId: string;
  setEMail: React.Dispatch<SetStateAction<string>>;
  eMail: string;
  successMessage: string;
  count: number;
  setCount: React.Dispatch<SetStateAction<number>>;
  setListId: React.Dispatch<SetStateAction<string>>;
  resetSignatureListState: () => void;
};

const CountSignaturesForm = ({
  state,
  updateSignatureList,
  listId,
  userId,
  setEMail,
  eMail,
  successMessage,
  count,
  setCount,
  setListId,
  resetSignatureListState,
}: CountSignatureFormProps) => {
  const needsEmail = !userId && !eMail;

  if (state === 'saving') {
    return (
      <FinallyMessage
        colorScheme={IS_BERLIN_PROJECT ? 'colorSchemeRoseOnWhite' : undefined}
        loading
      >
        Speichere...
      </FinallyMessage>
    );
  }

  if (state === 'saved') {
    return (
      <FinallyMessage colorScheme={IS_BERLIN_PROJECT ? 'colorSchemeRoseOnWhite' : undefined}>
        <>{successMessage}</>
        <CTAButtonContainer className={s.buttonContainer}>
          <CTAButton
            size="MEDIUM"
            onClick={() => {
              setListId('');
              resetSignatureListState();
            }}
          >
            Mehr eintragen
          </CTAButton>
        </CTAButtonContainer>
      </FinallyMessage>
    );
  }

  if (
    state === 'error' ||
    state === 'userNotFound' ||
    state === 'listNotFound' ||
    state === 'listAndUserNotFound'
  ) {
    return (
      <FinallyMessage colorScheme={IS_BERLIN_PROJECT ? 'colorSchemeRoseOnWhite' : undefined}>
        <>
          {state === 'userNotFound' && (
            <>
              <h2>Hoppla!</h2>
              <p>
                Wir haben deine E-Mail-Adresse leider nicht gefunden. Hast du
                dich vertippt? Dann versuche es erneut:
              </p>

              <CTAButtonContainer
                className={cN(s.buttonContainer, s.buttonContainerMessage)}
              >
                <CTAButton
                  size="MEDIUM"
                  onClick={() => {
                    setEMail('');
                    resetSignatureListState();
                  }}
                >
                  Neuer Versuch
                </CTAButton>
              </CTAButtonContainer>
              <p>
                Oder registriere dich neu bei uns, um die Unterschriften
                einzutragen:
              </p>
              <SignUp
                initialValues={{
                  email: eMail,
                }}
                postSignupAction={async () => {
                  const data = {
                    userId,
                    listId,
                    count,
                  };
                  setCount(parseInt(data.count.toString()));
                  await updateSignatureList(data);
                }}
              />
              <p>
                Funktioniert auch das nicht? Dann schreib uns an{' '}
                <a href="mailto:support@expedition-grundeinkommen.de">
                  support@expedition-grundeinkommen.de
                </a>
                .
              </p>
            </>
          )}
          {state === 'error' && (
            <>
              Da ist was schief gegangen. Melde dich bitte bei{' '}
              <a href="mailto:support@expedition-grundeinkommen.de">
                support@expedition-grundeinkommen.de
              </a>{' '}
              und sende uns folgenden Text: listId={listId}.
            </>
          )}
          {state === 'listNotFound' && (
            <>
              Die Liste mit dem Barcode {listId} konnten wir leider nicht
              finden. Bitte probiere es noch ein Mal.
              <CTAButtonContainer className={s.buttonContainer}>
                <CTAButton
                  size="MEDIUM"
                  onClick={() => {
                    setListId('');
                    resetSignatureListState();
                  }}
                >
                  Neuer Versuch
                </CTAButton>
              </CTAButtonContainer>
            </>
          )}
          {state === 'listAndUserNotFound' && (
            <>
              Die Liste mit dem Barcode {listId} und den Benutzer {eMail}{' '}
              konnten wir leider nicht finden. Bitte probiere es noch ein Mal.
              <CTAButtonContainer className={s.buttonContainer}>
                <CTAButton
                  size="MEDIUM"
                  onClick={() => {
                    setListId('');
                    setEMail('');
                    resetSignatureListState();
                  }}
                >
                  Neuer Versuch
                </CTAButton>
              </CTAButtonContainer>
            </>
          )}
        </>
      </FinallyMessage>
    );
  }

  return (
    <>
      <Form
        onSubmit={data => {
          // We can set both the list id and user id here,
          // because if the param is not set it will just be null
          data.userId = userId;

          if (data.listId) {
            setListId(data.listId);
          } else {
            data.listId = listId;
          }

          // If user clicks on 'Mehr eintragen', the email cannot be read from the form.
          // Therefore, we have to add it to the data object manually.
          if (data.email) {
            setEMail(data.email);
          } else if (eMail) {
            data.email = eMail;
          }

          setCount(parseInt(data.count.toString()));
          updateSignatureList(data);
        }}
        validate={(values: Values) => validate(values, needsEmail, !listId)}
        render={({ handleSubmit }) => {
          return (
            <FinallyMessage colorScheme={IS_BERLIN_PROJECT ? 'colorSchemeRoseOnWhite' : undefined}>
              <h2 className={s.headingSelfScan}>
                Unterschriften selber eintragen
              </h2>
              <FormWrapper>
                <form onSubmit={handleSubmit}>
                  {needsEmail && (
                    <FormSection className={s.formSection}>
                      <Field
                        name="email"
                        label="Bitte gib deine E-Mail-Adresse ein."
                        placeholder="E-Mail"
                        component={TextInputWrapped as any}
                        type="email"
                        className={s.label}
                      ></Field>
                    </FormSection>
                  )}
                  <FormSection
                    className={s.formSection}
                    fieldContainerClassName={s.formSectionCombined}
                  >
                    <div className={s.fieldContainer}>
                      <p className={s.fieldLabel}>Anzahl Unterschriften</p>
                      <Field
                        name="count"
                        label=""
                        placeholder="1"
                        component={TextInputWrapped as any}
                        type="number"
                        min={1}
                        className={s.label}
                        inputClassName={s.countField}
                        inputMode="numeric"
                        pattern="[0-9]*"
                      ></Field>
                    </div>
                    <>
                      {!listId && (
                        <div className={s.fieldContainer}>
                          <p className={s.fieldLabel}>
                            Barcode auf der Unterschriftenliste
                          </p>
                          <Field
                            name="listId"
                            label=""
                            placeholder=""
                            component={TextInputWrapped as any}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            min={1}
                            className={s.label}
                            inputClassName={s.listIdField}
                          ></Field>
                        </div>
                      )}
                    </>
                  </FormSection>

                  <CTAButtonContainer className={s.buttonContainer}>
                    <CTAButton type="submit" size="MEDIUM">
                      Eintragen
                    </CTAButton>
                  </CTAButtonContainer>
                </form>
              </FormWrapper>
            </FinallyMessage>
          );
        }}
      />
    </>
  );
};

type Values = {
  count: number;
  listId: string;
  email: string;
  userId: string;
};

type Errors = {
  count?: string;
  listId?: string;
  email?: string;
};

const validate = (
  values: Values,
  needsEmail: boolean,
  needsListId: boolean
) => {
  const errors: Errors = {};

  if (!values.count) {
    errors.count = 'Muss ausgefüllt sein';
  }

  if (needsListId && !values.listId) {
    errors.listId = 'Muss ausgefüllt sein';
  }

  if (values.count && values.count < 0) {
    errors.count = 'Nix, es gibt keine negative Anzahl an Unterschriften!';
  }

  if (needsEmail && !validateEmail(values.email)) {
    errors.email = 'Wir benötigen eine valide E-Mail Adresse';
  }

  return errors;
};

export default SelfScan;

import { useContext } from 'react';
import { OnboardingModalContext } from '../../context/OnboardingModal';
import * as _actions from './_actions';

type DirectusActions = {
  [key: string]: () => void;
};

export const useActions = (): [DirectusActions] => {
  const { setShowModal } = useContext(OnboardingModalContext);

  // Some actions might be imported from the _actions.ts file,
  // but others need react hooks, so we define them here and
  // combine both in one accessible object.
  // Note that naming of the following functions have to match
  // the action entries in directus.
  const actions = {
    openOnboardingFlow: () => setShowModal(true),
    ..._actions,
  };

  return [actions];
};

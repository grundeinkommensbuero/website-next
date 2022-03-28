import { ReactElement } from 'react';
import { AuthProvider } from '../../context/Authentication';
import { OnboardingModalProvider } from '../../context/OnboardingModal';
import { QueryClientProvider, QueryClient } from 'react-query';
import { XbgeAppProvider } from '../../context/App';

type ProviderWrapperProps = {
  children: ReactElement | ReactElement[] | string;
};

const queryClient = new QueryClient();

export const ProviderWrapper = ({
  children,
}: ProviderWrapperProps): ReactElement => {
  return (
    <XbgeAppProvider>
      <AuthProvider>
        <OnboardingModalProvider>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </OnboardingModalProvider>
      </AuthProvider>
    </XbgeAppProvider>
  );
};

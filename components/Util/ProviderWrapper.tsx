import { ReactElement } from 'react';
import { AuthProvider } from '../../context/Authentication';
import { OnboardingModalProvider } from '../../context/OnboardingModal';
import { QueryClientProvider, QueryClient } from 'react-query';
import { XbgeAppProvider } from '../../context/App';
import { MunicipalityProvider } from '../../context/Municipality';

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
        <MunicipalityProvider>
          <OnboardingModalProvider>
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </OnboardingModalProvider>
        </MunicipalityProvider>
      </AuthProvider>
    </XbgeAppProvider>
  );
};

const useDevBackend =
  process.env.NODE_ENV === 'development' ||
  process.env.NEXT_PUBLIC_USE_DEV_BACKEND === 'override';

let API_INVOKE_URL = useDevBackend
  ? 'https://51kjphvbxi.execute-api.eu-central-1.amazonaws.com/dev'
  : 'https://ag5gu1z06h.execute-api.eu-central-1.amazonaws.com/prod';

let USER_POOL_ID = useDevBackend
  ? 'eu-central-1_uLU400Ns2'
  : 'eu-central-1_xx4VmPPdF';

const cognitoConfig = {
  COGNITO: {
    REGION: 'eu-central-1',
    USER_POOL_ID: USER_POOL_ID,
  },
  API: {
    INVOKE_URL: API_INVOKE_URL,
  },
  APP_API: {
    INVOKE_URL:
      process.env.NODE_ENV === 'development'
        ? 'https://app-server.xbge.de'
        : 'https://app-server.xbge.de',
  },
};

export default cognitoConfig;

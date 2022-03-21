import { NextPageContext } from 'next';

const Error = ({ statusCode }: { statusCode: number }) => {
  return (
    <p>
      {statusCode
        ? `Ooops, bei uns ist etwas schief gegangen! :O ${statusCode}`
        : 'Ooops, bei uns ist etwas schief gegangen!'}
    </p>
  );
};

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;

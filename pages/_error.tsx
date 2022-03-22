import { NextPageContext } from 'next';

const Error = ({ statusCode }: { statusCode: number }) => {
  return (
    <h3 style={{ textAlign: 'center', margin: '2rem 5rem' }}>
      {statusCode
        ? `Ooops, bei uns ist etwas schief gegangen! :O ${statusCode}`
        : 'Ooops, bei uns ist etwas schief gegangen!'}
    </h3>
  );
};

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;

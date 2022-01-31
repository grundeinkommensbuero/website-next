const graphQLAPI = process.env.NEXT_PUBLIC_GRAPHQL || '';

const fetchData = async (query: string, { variables = {} }) => {
  const headers = { 'Content-Type': 'application/json' };

  const res = await fetch(graphQLAPI, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await res.json();

  if (json.errors) {
    throw new Error(json.errors);
  }

  return json;
};

export default fetchData;

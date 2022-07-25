// Get the directus url from env
const directusInstance = process.env.NEXT_PUBLIC_DIRECTUS_ROOT
  ? process.env.NEXT_PUBLIC_DIRECTUS_ROOT
  : process.env.NEXT_PUBLIC_DIRECTUS;

// Get graphql endpoint url
const graphQLAPI = directusInstance ? `${directusInstance}graphql/` : '';

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
    console.log(json.errors);
    console.log(json.errors[0].extensions.graphqlErrors);
    throw new Error(json.errors);
  }

  return json;
};

export default fetchData;

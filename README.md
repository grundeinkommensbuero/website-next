# Expedition Grundeinkommen

Frontend for _Volksinitiativen_ Platform for Expedition Grundeinkommen and Volksentscheid Grundeinkommen. Some features are also used as iframes in the Berlin 2030 campaign.

## Code of Conduct

[Here](codeofconduct.md)

## Develop:

```bash
yarn install
yarn dev
```

## Tech Stack:

- Next.js / React
- TypeScript
- Directus as headless cms
- SASS with SCSS syntax

## Core Concepts:

- Page-Data is fetched per page from Directus, either with a dynamic slug or an explicit id, and accessible as prop for each page
- Each page can have any number of section components, that will be rendered through the "Sections" component
- Sections can have any number of elements, that will be rendered inside
- Section elements: Text, Image, Video, Component and CTA-Button

## Dev best practices

### Git

You can either rebase, merge or squash, depending on the case of the pr. For instance, if it is important to keep individual commits.

### Linting and formatting

A `.prettierrc` file is included. You can install a Prettier plugin in your text editor, it will automatically detect the `.prettierrc`. It can be set to format according to these settings on save (in VS Code this is enabled by default). Formatting will be checked by Github actions.

## Integrations

The frontend interacts with Content APIs (run at build time), and with our own APIs, as defined in our [backend](https://github.com/grundeinkommensbuero/backend).

**None of the integrations have a local development environment.** The development environment gets this data from development instances of the hosted services.

## Content services

Most Content APIS are loaded statically at build time, some only server-side.

### Directus

Used for statically and server-side rendered content. Data is loaded in the corresponding Next function getStaticProps or getServerSideProps. The function getPageProps in /utils/getPageProps.ts fetches the data from directus.

### API and DB

The API runs on the Serverless Framework, deployed on AWS. The URL for accessing the API is configured in `backend-config.js`, which uses the dev or prod endpoints depending on the environment variable.

Use the endpoints like this:

```js
import CONFIG from '../../../backend-config';

const url = `${CONFIG.API.INVOKE_URL}/analytics/signatures`,

fetch(url, {...});
```

We use Dynamo DB as database.

### User Management

- Handled by Cognito.
- Uses Amplify frontend library for connecting to Cognito.
- Implemented in the Authentication context and the Authentication hook.
- User table in the database is linked to Cognito user database by the cognito id.

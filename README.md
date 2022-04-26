# Expedition Grundeinkommen - Next prototype

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

## Dependency Graph:

![Dependencies](./dependencygraph.svg)
<!-- <img src="./dependencygraph.svg"> -->
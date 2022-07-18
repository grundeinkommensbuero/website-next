import { Directus } from '@directus/sdk';

export type Menu = Array<MenuEntry | Dropdown>;

export type MenuEntry = {
  id: string;
  status: string;
  sort: number | null;
  label: string;
  slug: string;
};

export type Dropdown = {
  id: string;
  status: string;
  sort: number | null;
  label: string;
  entries: MenuEntry[];
};

type FetchedMenu = {
  id: string;
  name: string;
  status: string;
  elements: FetchedEntries[];
};

type FetchedEntries = {
  item: {
    id: string;
    status: string;
    sort: number | null;
    label: string;
    slug?: string;
    entries?: NestedFetchedEntries[];
  };
};

type NestedFetchedEntries = {
  menuentry_id: {
    id: string;
    status: string;
    sort: number | null;
    label: string;
    slug: string;
  };
};

type Menus = {
  mainMenu: Menu;
  footerMenu: Menu;
};

const MAINMENU_ID = 2;
const FOOTERMENU_ID = 3;

const menuFields = [
  'id',
  'name',
  'status',
  'elements.item.id',
  'elements.item.status',
  'elements.item.sort',
  'elements.item.label',
  'elements.item.slug',
  'elements.item.entries.menuentry_id.id',
  'elements.item.entries.menuentry_id.status',
  'elements.item.entries.menuentry_id.sort',
  'elements.item.entries.menuentry_id.label',
  'elements.item.entries.menuentry_id.slug',
];

export const getMenus = async (): Promise<Menus> => {
  const directus = new Directus(process.env.NEXT_PUBLIC_DIRECTUS || '');

  try {
    // Get menus from directus by id (ID)
    const _mainMenu = (await directus.items('menu').readOne(MAINMENU_ID, {
      fields: menuFields,
    })) as FetchedMenu;

    const _footerMenu = (await directus.items('menu').readOne(FOOTERMENU_ID, {
      fields: menuFields,
    })) as FetchedMenu;

    return {
      mainMenu: updateMenuStructure(_mainMenu),
      footerMenu: updateMenuStructure(_footerMenu),
    };
  } catch (err) {
    console.log(err);
    return {
      mainMenu: [],
      footerMenu: [],
    };
  }
};

const updateMenuStructure = (fetchedMenu: FetchedMenu): Menu => {
  return fetchedMenu.elements.map(element => {
    const entryBase = {
      id: element.item.id,
      status: element.item.status,
      sort: element.item.sort,
      label: element.item.label,
    };
    if (element.item.slug) {
      return {
        ...entryBase,
        slug: element.item.slug,
      } as MenuEntry;
    } else {
      return {
        ...entryBase,
        entries: element.item.entries?.map(entry => {
          return {
            id: entry.menuentry_id.id,
            status: entry.menuentry_id.status,
            sort: entry.menuentry_id.sort,
            label: entry.menuentry_id.label,
            slug: entry.menuentry_id.slug,
          };
        }),
      } as Dropdown;
    }
  });
};

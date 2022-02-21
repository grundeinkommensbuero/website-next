import { Directus } from '@directus/sdk';

export type Mainmenu = Array<MenuEntry | Dropdown>;

export type MenuEntry = {
  id: number;
  status: string;
  sort: number | null;
  label: string;
  slug: string;
};

export type Dropdown = {
  id: number;
  status: string;
  sort: number | null;
  label: string;
  entries: MenuEntry[];
};

type FetchedMenu = {
  id: number;
  status: string;
  name: string;
  elements: DirectusJoinElement[];
};

type DirectusJoinElement = {
  id: number;
  collection: string;
  item: string;
};

type FetchedEntries = {
  id: number;
  status: string;
  sort: number | null;
  label: string;
  slug: string;
  entries: FetchedMenuEntry[];
};

type FetchedMenuEntry = {
  menuentry_id: MenuEntry;
};

type Menus = {
  mainmenu: Mainmenu;
};

const MAINMENU_ID = 1;

export const getMenus = async (): Promise<Menus> => {
  const directus = new Directus(process.env.DIRECTUS || '');

  try {
    // Get menus from directus by id (ID)
    const _mainmenu = (await directus.items('menu').readOne(MAINMENU_ID, {
      fields: [
        'id',
        'status',
        'name',
        'elements.id',
        'elements.collection',
        'elements.item',
      ],
    })) as FetchedMenu;

    // Get all menu entries for the current menu
    const _menuEntries: Array<FetchedEntries> = await Promise.all(
      _mainmenu.elements.map(
        async (element) =>
          (await directus.items(element.collection).readOne(element.item, {
            fields: [
              'id',
              'status',
              'sort',
              'label',
              'slug',
              'menuentries.id',
              'entries.menuentry_id.label',
              'entries.menuentry_id.status',
              'entries.menuentry_id.sort',
              'entries.menuentry_id.slug',
            ],
          })) as FetchedEntries
      )
    );

    const mainmenu: Mainmenu = _menuEntries.map((menuElement) => {
      if (!menuElement.entries) return menuElement;
      const updatedEntry: Dropdown = {
        ...menuElement,
        entries: menuElement.entries.map((x) => x.menuentry_id),
      };
      return updatedEntry;
    });

    return {
      mainmenu,
    };
  } catch (err) {
    console.log(err);
    return {
      mainmenu: [],
    };
  }
};

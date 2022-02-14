import { Directus } from '@directus/sdk';

type DirectusJoinElement = {
  id: number;
  collection: string;
  item: string;
};

export type MenuElement = {
  id: number;
  name: string;
  slug: string;
  label: string;
  entries?: MenuElement[];
  menuentries?: MenuElement[];
  menuentry_id: number | MenuElement;
  resolvedEntries: MenuElement[];
};

type Menu = {
  elements: DirectusJoinElement[];
};

type Menus = {
  mainmenu: MenuElement[];
};

export const getMenus = async (): Promise<Menus> => {
  const directus = new Directus(process.env.DIRECTUS || '');

  try {
    // Get menus from directus by id (ID)
    const _mainmenu = (await directus.items('menu').readOne(1, {
      fields: [
        'id',
        'status',
        'name',
        'elements.id',
        'elements.collection',
        'elements.item',
      ],
    })) as Menu;

    // Get all menu entries for the current menu by ID
    const _menuEntries: MenuElement[] = await Promise.all(
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
          })) as MenuElement
      )
    );

    return {
      mainmenu: _menuEntries,
    };
  } catch (err) {
    console.log(err);
    return {
      mainmenu: [],
    };
  }
};

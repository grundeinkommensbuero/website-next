import { Directus } from '@directus/sdk';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Custom fields added to Directus user collection.
  type UserType = {
    level: number;
    experience: number;
  };

  type CustomTypes = {
    /*
	This type will be merged with Directus user type.
	It's important that the naming matches a directus
	collection name exactly. Typos won't get caught here
	since SDK will assume it's a custom user collection.
	*/
    directus_users: UserType;
  };

  const directus = new Directus<CustomTypes>(process.env.DIRECTUS || '');

  const authenticate = async () => {
    const token = await directus.auth.login({
      email: 'mail',
      password: 'password',
    });
    return token;
  };

  authenticate().then(async (token) => {
    console.log(token);

    const user = await directus.users.me.read();
    console.log(user);
  });

  // const me = async () => {
  //   const user = await directus.users.me.read();
  //   console.log(user);
  //   return user;
  // };

  // console.log(me());

  // OK
  // me.level = 42;

  // Error TS2322: Type "string" is not assignable to type "number".
  // me.experience = 'high';

  res.status(200).json({ name: 'John Doe' });
}

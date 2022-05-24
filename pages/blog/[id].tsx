import { GetServerSideProps } from 'next';
import { ReactElement } from 'react';
import { Blogpost } from '.';
import fetchData from './fetchData';
import { PostFull } from '../../components/Blog/PostFull';
import { Mainmenu } from '../../utils/getMenus';
import { Layout } from '../../layout';

type PostProps = {
  blogpost: Blogpost;
  mainmenu: Mainmenu;
};

const PostPage = ({ blogpost, mainmenu }: PostProps): ReactElement => {
  return (
    <Layout mainmenu={mainmenu}>
      <PostFull
        title={blogpost.title}
        content={blogpost.content}
        assetId={blogpost.featured_image.id}
      />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const query = `query {
    blogposts_by_id(id: "${params?.id}") {
      id
      title
      featured_image {
        id
      }
      content
    }
  }`;

  const variables = {
    variables: {},
  };

  const blogpost: Promise<Blogpost> = await fetchData(query, variables).then(
    data => {
      return data.data.blogposts_by_id;
    }
  );

  return {
    props: {
      blogpost,
    },
  };
};

export default PostPage;

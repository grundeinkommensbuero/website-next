import { GetServerSideProps } from 'next';
import { ReactElement } from 'react';
import { Blogpost } from '.';
import fetchData from '../../directus/graphql/fetchData';
import { PostFull } from '../../components/Blog/PostFull';
import { getAssetURL } from '../../utils/getAssetURL';

type PostProps = {
  blogpost: Blogpost;
};

const PostPage = ({ blogpost }: PostProps): ReactElement => {
  return (
    <PostFull
      title={blogpost.title}
      content={blogpost.content}
      imageURL={getAssetURL(blogpost.featured_image.id)}
    />
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
    (data) => {
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

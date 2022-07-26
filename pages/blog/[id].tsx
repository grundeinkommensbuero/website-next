import { GetServerSideProps } from 'next';
import { ReactElement } from 'react';
import { Blogpost } from '.';
import fetchData from '../../utils/fetchData';
import { PostFull } from '../../components/Blog/BlogPost';

type PostProps = {
  blogpost: Blogpost;
};

const PostPage = ({ blogpost }: PostProps): ReactElement => {
  return (
    <PostFull
      title={blogpost.title}
      content={blogpost.content}
      assetId={blogpost.featured_image.id}
      date={blogpost.date}
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
      date
      teaser
    }
  }`;

  const variables = {
    variables: {},
  };

  const blogpost: Promise<Blogpost> = await fetchData(
    query,
    variables,
    true
  ).then(data => {
    return data.data.blogposts_by_id;
  });

  return {
    props: {
      blogpost,
    },
  };
};

export default PostPage;

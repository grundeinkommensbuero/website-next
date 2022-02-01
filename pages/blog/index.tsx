import type { GetServerSideProps } from 'next';
import { ReactElement } from 'react';
import { PostExcerpt } from '../../components/blog/PostExcerpt';
import fetchData from '../../directus/graphql/fetchData';
import { getAssetURL } from '../../utils/getAssetURL';

export type Blogpost = {
  id: string;
  title: string;
  content: string;
  featured_image: {
    id: string;
  };
};

const query = `query Blogposts {
  blogposts {
    id
    title
    featured_image {
      id
    }
    content
  }
}
`;

const variables = {
  variables: {},
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const blogposts: Promise<Blogpost[]> = await fetchData(query, variables).then(
    (data) => {
      return data.data.blogposts;
    }
  );
  return {
    props: {
      blogposts,
    },
  };
};

type SSProps = {
  blogposts: Blogpost[];
};

const Blog = ({ blogposts }: SSProps): ReactElement => {
  return (
    <>
      <h2 className='mx-8'>Expeditionsblog:</h2>
      <div className='flex flex-wrap xs:flex-column justify-around'>
        {blogposts &&
          blogposts.map((post) => {
            return (
              <PostExcerpt
                key={post.id}
                title={post.title}
                content={post.content}
                imageURL={getAssetURL(post.featured_image.id)}
                id={post.id}
              />
            );
          })}
      </div>
    </>
  );
};

export default Blog;

import type { GetServerSideProps } from 'next';
import { ReactElement } from 'react';
import { PostExcerpt } from '../../components/Blog/PostExcerpt';
import { BlogList } from '../../components/LegacyBlog/BlogList';
import fetchData from './fetchData';

export type Blogpost = {
  id: string;
  title: string;
  content: string;
  date: string;
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
    date
  }
}
`;

const variables = {
  variables: {},
};

export const getServerSideProps: GetServerSideProps = async context => {
  const blogposts: Promise<Blogpost[]> = await fetchData(query, variables).then(
    data => {
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
      <h2 className="mx-8">Expeditionsblog:</h2>
      <BlogList posts={blogposts} />
      {/* <div className="flex flex-wrap xs:flex-column justify-around">
        {blogposts && blogposts.length > 0 ? (
          blogposts.map(post => {
            return (
              <PostExcerpt
                key={post.id}
                title={post.title}
                content={post.content}
                assetId={post.featured_image.id}
                id={post.id}
              />
            );
          })
        ) : (
          <h2 className="text-center my-8 text-violet">Keine Einträge</h2>
        )}
      </div> */}
    </>
  );
};

export default Blog;

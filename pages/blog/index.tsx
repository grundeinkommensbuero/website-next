import type { GetServerSideProps } from 'next';
import { ReactElement } from 'react';
import { BlogList } from '../../components/Blog/BlogList';
import fetchData from './fetchData';

export type Blogpost = {
  id: string;
  title: string;
  content: string;
  date: string;
  teaser: string;
  featured_image: {
    id: string;
  };
};

const query = `query Blogposts {
  blogposts(
    sort: [ "-date" ]
  ) {
    id
    title
    featured_image {
      id
    }
    content
    date
    teaser
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
    <div className="sections">
      {/* <h2 className="my-8">Expeditionsblog:</h2> */}
      <BlogList posts={blogposts} />
    </div>
  );
};

export default Blog;

import type { GetServerSideProps, GetStaticProps } from 'next';
import { ReactElement } from 'react';
import { BlogList } from '../../components/Blog/BlogList';
import fetchData from '../../utils/fetchData';

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

export const getStaticProps: GetStaticProps = async () => {
  const blogposts: Promise<Blogpost[]> = await fetchData(
    query,
    variables,
    true
  ).then(data => {
    return data.data.blogposts;
  });
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

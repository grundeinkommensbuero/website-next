import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { Blogpost } from '../pages/api/content/blogposts';
import { BlogPost } from '../components/Blog/BlogPost';

const Blog: NextPage = () => {
  const [data, setData] = useState<Blogpost[]>([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('api/content/blogposts')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <h2 className='text-center'>Expeditionsblog:</h2>
      <div className='flex justify-around'>
        {data &&
          data.map((post) => {
            return (
              <BlogPost
                key={post.id}
                title={post.title}
                content={post.content}
                featured_image={post.featured_image.id}
              />
            );
          })}
      </div>
    </>
  );
};

export default Blog;

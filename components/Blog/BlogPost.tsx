import Image from 'next/image';
import parseHTML from 'html-react-parser';

type BlogProps = {
  title: string;
  content: string;
  featured_image: string;
};

export const BlogPost = ({ title, content, featured_image }: BlogProps) => {
  return (
    <div className='max-w-xs rounded overflow-hidden shadow-lg my-2'>
      <Image
        src={`${process.env.NEXT_PUBLIC_DIRECTUS}assets/${featured_image}`}
        alt='Bild zum Blogpost'
        height={500}
        width={500}
      />
      <div className='px-6 py-4'>
        <h2 className='text-xl mb-2'>{title}</h2>
        {parseHTML(content)}
      </div>
    </div>
  );
};

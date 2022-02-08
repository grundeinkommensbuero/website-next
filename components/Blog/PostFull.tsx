import Image from 'next/image';
import parseHTML from 'html-react-parser';

type BlogProps = {
  title: string;
  content: string;
  imageURL: string;
};

export const PostFull = ({ title, content, imageURL }: BlogProps) => {
  return (
    <div className={`m-4 overflow-hidden shadow-lg relative`}>
      <Image
        src={imageURL}
        alt='Bild zum Blogpost'
        height={600}
        width={2000}
        className='object-cover h-full w-full'
      />
      <div className='px-6 py-4'>
        <h2 className='text-d-xl mb-2'>{title}</h2>
        {parseHTML(content)}
      </div>
    </div>
  );
};

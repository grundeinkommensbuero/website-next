import Image from 'next/image';
import parseHTML from 'html-react-parser';
import { useRouter } from 'next/router';
// import { encodeURL } from '../../utils/encodeURL';

type BlogProps = {
  title: string;
  content: string;
  imageURL: string;
  id: string;
};

export const PostExcerpt = ({ title, content, imageURL, id }: BlogProps) => {
  const router = useRouter();

  const border = 'border-2 border-white hover:border-violet rounded';
  const cardWidth = '2xl:max-w-md md:max-w-xs h-160';

  return (
    <div
      // onClick={() => router.push(`/blog/${encodeURL(title)}`)}
      onClick={() => router.push(`/blog/${id}`)}
      className={`${border} ${cardWidth} m-4 hover:cursor-pointer overflow-hidden shadow-lg relative`}>
      <Image
        src={imageURL}
        alt='Bild zum Blogpost'
        height={600}
        width={2000}
        className='object-cover h-full w-full'
      />
      <div className='px-6 py-4'>
        <h2 className='text-xl mb-2'>{title}</h2>
        {parseHTML(content)}
      </div>
      <div className='absolute bottom-0 w-full text-center'>
        <div className='h-16 bg-gradient-to-t from-white'></div>
        <div className='w-full bg-white'>
          <h2>Weiterlesen!</h2>
        </div>
      </div>
    </div>
  );
};

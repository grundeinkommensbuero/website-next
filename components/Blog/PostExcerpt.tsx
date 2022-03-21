import parseHTML from 'html-react-parser';
import { useRouter } from 'next/router';
import { DirectusImage } from '../Util/DirectusImage';

type BlogProps = {
  title: string;
  content: string;
  assetId: string;
  id: string;
};

export const PostExcerpt = ({ title, content, assetId, id }: BlogProps) => {
  const router = useRouter();

  return (
    <div
      // onClick={() => router.push(`/blog/${encodeURL(title)}`)}
      onClick={() => router.push(`/blog/${id}`)}
      className={`w-quarter h-128 rounded m-4 cursor-pointer overflow-hidden shadow-lg relative`}
    >
      <DirectusImage
        assetId={assetId}
        alt="Bild zum Blogpost"
        className="object-cover h-full w-full"
        overrideHeight={600}
        overrideWidth={2000}
      />
      <div className="px-6 py-4">
        <h2 className="text-d-xl mb-2">{title}</h2>
        {parseHTML(content)}
      </div>
      <div className="absolute bottom-0 w-full text-center">
        <div className="h-16 bg-gradient-to-t from-white"></div>
        <div className="w-full bg-white">
          <h2 className="m-0 pb-4 pt-4 text-d-xl text-violet">Weiterlesen!</h2>
        </div>
      </div>
    </div>
  );
};

import parseHTML from 'html-react-parser';
import { DirectusImage } from '../Util/DirectusImage';

type BlogProps = {
  title: string;
  content: string;
  assetId: string;
};

export const PostFull = ({ title, content, assetId }: BlogProps) => {
  return (
    <div className={`m-4 overflow-hidden shadow-lg relative`}>
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
    </div>
  );
};

import Image from 'next/image';
import { ReactElement } from 'react';
import parseHTML from 'html-react-parser';

import { Element } from '../../pages/[id]';
import { getAssetURL } from '../../utils/getAssetURL';
import dynamic from 'next/dynamic';

type SectionProps = {
  section: Section;
};

export type Section = {
  id: string;
  title: string;
  sort: number | null;
  status: string;
  elements: number[];
  render: Element[];
  colorScheme: string;
};

export const Section = ({ section }: SectionProps): ReactElement => {
  return (
    <section className={`py-16 ${section.colorScheme}`}>
      <section className='sections'>
        <h2 className='mb-4'>{section.title}</h2>
        {section.render.map((element) => {
          switch (element.collection) {
            case 'sectionsText':
              return (
                <div className='mb-8' key={element.id}>
                  {parseHTML(element.content)}
                </div>
              );
            case 'sectionsImage':
              return (
                <div key={element.id} className='mb-8'>
                  <Image
                    src={getAssetURL(element.image)}
                    alt='Bild zum Blogpost'
                    height={600}
                    width={2000}
                    className='object-cover h-full w-full'
                  />
                </div>
              );
            case 'reactComponent':
              const Component = dynamic(
                () => import(`../_dynamic/${element.component}`),
                { ssr: false, loading: () => null }
              );
              return (
                <div key={element.id} className='mb-8'>
                  <Component key={element.id} />
                </div>
              );
            default:
              return null;
          }
        })}
      </section>
    </section>
  );
};

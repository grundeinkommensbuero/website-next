import Image from 'next/image';
import { ReactElement, useState } from 'react';
import parseHTML from 'html-react-parser';

import { getAssetURL } from '../../utils/getAssetURL';
import dynamic from 'next/dynamic';

import cN from 'classnames';
import s from './style.module.scss';
import { getEvenLayout, getOddLayout, getOverrideLayout } from './utlis';

import ReactTooltip from 'react-tooltip';

import Icon from '@mdi/react';
import {
  mdiPageLayoutHeader,
  mdiPageLayoutHeaderFooter,
  mdiDockLeft,
  mdiTablet,
  mdiBackspaceOutline,
  mdiPlaylistEdit,
} from '@mdi/js';
import { SelectColor } from './SelectColor';
import { Tiptap } from '../Editor/Tiptap';

type SectionProps = {
  section: Section;
};

export type Layout = '100' | '75-25' | '50-50' | '25-75';

export type OverrideLayout = '100' | '75' | '50' | '25' | null;

export type ColorScheme =
  | 'colorSchemeAqua'
  | 'colorSchemeViolet'
  | 'colorSchemeWhite'
  | 'colorSchemeRed';

export type Section = {
  id: string;
  title: string;
  sort: number | null;
  status: string;
  elements: number[];
  render: Element[];
  colorScheme: ColorScheme;
  layout: Layout;
};

export type Element = {
  id: string;
  title: string;
  content: string;
  image: string;
  component: string;
  collection: string;
  sort: number | null;
  overrideLayout: string | null;
  align: string;
  edit?: boolean;
};

export const Section = ({ section }: SectionProps): ReactElement => {
  const [modifiedSection, setModifiedSection] = useState<Section>(section);

  const loggedIn = false;

  const updateSectionLayout = (layout: Layout): void => {
    const updated = {
      ...modifiedSection,
      layout,
    };
    setModifiedSection(updated);
  };

  const updateColorScheme = (colorScheme: ColorScheme): void => {
    const updated = {
      ...modifiedSection,
      colorScheme,
    };
    setModifiedSection(updated);
  };

  const updateElementLayout = (
    overrideLayout: OverrideLayout,
    index: number
  ): void => {
    // Get and update the edited element
    const updatedElement: Element = {
      ...modifiedSection.render[index],
      overrideLayout,
    };
    // Replace it in render list
    const updatedRender = modifiedSection.render.map((element, elIndex) => {
      if (elIndex === index) {
        return updatedElement;
      }
      return element;
    });
    // Update renderlist in section
    const updated = {
      ...modifiedSection,
      render: updatedRender,
    };
    setModifiedSection(updated);
  };

  const editElement = (edit: boolean, index: number): void => {
    // Get and update the edited element
    const updatedElement: Element = {
      ...modifiedSection.render[index],
      edit,
    };
    // Replace it in render list
    const updatedRender = modifiedSection.render.map((element, elIndex) => {
      if (elIndex === index) {
        return updatedElement;
      }
      return element;
    });
    // Update renderlist in section
    const updated = {
      ...modifiedSection,
      render: updatedRender,
    };
    setModifiedSection(updated);
  };

  return (
    <>
      <ReactTooltip backgroundColor='black' />

      <div className={cN(s.editSection, { [s.hide]: !loggedIn })}>
        <div className='sections flex'>
          <button
            className='noStyleButton'
            onClick={() => updateSectionLayout('25-75')}>
            <Icon
              path={mdiDockLeft}
              title='Layout 25-75'
              size={1.25}
              horizontal
              vertical
              rotate={180}
              color='gray'
              data-tip='Layout 25%-75%'
            />
          </button>

          <button
            className='noStyleButton'
            onClick={() => updateSectionLayout('50-50')}>
            <Icon
              path={mdiPageLayoutHeaderFooter}
              title='Layout 50-50'
              size={1.25}
              horizontal
              vertical
              rotate={90}
              color='gray'
              data-tip='Layout 50%-50%'
            />
          </button>

          <button
            className='noStyleButton'
            onClick={() => updateSectionLayout('75-25')}>
            <Icon
              path={mdiPageLayoutHeader}
              title='Layout 75-25'
              size={1.25}
              horizontal
              vertical
              rotate={-90}
              color='gray'
              data-tip='Layout 75%-25%'
            />
          </button>

          <button
            className='noStyleButton'
            onClick={() => updateSectionLayout('100')}>
            <Icon
              path={mdiTablet}
              title='Layout 100'
              size={1.25}
              horizontal
              vertical
              rotate={0}
              color='gray'
              data-tip='Layout 100%'
            />
          </button>

          <SelectColor updateColorScheme={updateColorScheme} />
        </div>
      </div>

      <SectionWrapper
        colorScheme={modifiedSection.colorScheme}
        title={modifiedSection.title}>
        <div className='flexWrap'>
          {modifiedSection.render.map((element, index) => {
            const flexItemClass =
              index % 2 == 0
                ? getEvenLayout(modifiedSection.layout)
                : getOddLayout(modifiedSection.layout);

            const overrideFlexItemClass = getOverrideLayout(
              element.overrideLayout || ''
            );

            switch (element.collection) {
              case 'sectionsText':
                return (
                  <div
                    key={'editText' + element.id}
                    className={cN(
                      overrideFlexItemClass
                        ? overrideFlexItemClass
                        : flexItemClass
                    )}>
                    <div className={cN(s.editElement, { [s.hide]: !loggedIn })}>
                      <ReactTooltip backgroundColor='black' />
                      <button
                        className='noStyleButton'
                        onClick={() => updateElementLayout('25', index)}>
                        <Icon
                          path={mdiDockLeft}
                          title='Element Layout 25'
                          size={1.25}
                          horizontal
                          vertical
                          rotate={180}
                          color='gray'
                          data-tip='Element Layout 25%'
                        />
                      </button>
                      <button
                        className='noStyleButton'
                        onClick={() => updateElementLayout('50', index)}>
                        <Icon
                          path={mdiPageLayoutHeaderFooter}
                          title='Element Layout 50'
                          size={1.25}
                          horizontal
                          vertical
                          rotate={90}
                          color='gray'
                          data-tip='Element Layout 50%'
                        />
                      </button>
                      <button
                        className='noStyleButton'
                        onClick={() => updateElementLayout('75', index)}>
                        <Icon
                          path={mdiPageLayoutHeader}
                          title='Element Layout 75'
                          size={1.25}
                          horizontal
                          vertical
                          rotate={-90}
                          color='gray'
                          data-tip='Element Layout 75%'
                        />
                      </button>
                      <button
                        className='noStyleButton'
                        onClick={() => updateElementLayout('100', index)}>
                        <Icon
                          path={mdiTablet}
                          title='Element Layout 100'
                          size={1.25}
                          horizontal
                          vertical
                          rotate={0}
                          color='gray'
                          data-tip='Element Layout 100%'
                        />
                      </button>
                      <button
                        className='noStyleButton'
                        onClick={() => updateElementLayout(null, index)}>
                        <Icon
                          path={mdiBackspaceOutline}
                          title='Element Layout entfernen'
                          size={1.25}
                          horizontal
                          vertical
                          rotate={180}
                          color='gray'
                          data-tip='Element Layout entfernen'
                        />
                      </button>
                      <button
                        className='noStyleButton'
                        onClick={() =>
                          editElement(element.edit ? false : true, index)
                        }>
                        <Icon
                          path={mdiPlaylistEdit}
                          title='Text bearbeiten'
                          size={1.25}
                          horizontal
                          vertical
                          rotate={180}
                          color='gray'
                          data-tip='Text bearbeiten'
                        />
                      </button>
                    </div>

                    {!element.edit ? (
                      <div key={'text' + element.id}>
                        {parseHTML(element.content)}
                      </div>
                    ) : (
                      <Tiptap content={element.content} />
                    )}
                  </div>
                );
              case 'sectionsImage':
                return (
                  <div
                    key={'editImage' + element.id}
                    className={cN(
                      overrideFlexItemClass
                        ? overrideFlexItemClass
                        : flexItemClass
                    )}>
                    <div className={cN(s.editElement, { [s.hide]: !loggedIn })}>
                      <ReactTooltip backgroundColor='black' />
                      <button
                        className='noStyleButton'
                        onClick={() => updateElementLayout('25', index)}>
                        <Icon
                          path={mdiDockLeft}
                          title='Element Layout 25'
                          size={1.25}
                          horizontal
                          vertical
                          rotate={180}
                          color='gray'
                          data-tip='Element Layout 25%'
                        />
                      </button>
                      <button
                        className='noStyleButton'
                        onClick={() => updateElementLayout('50', index)}>
                        <Icon
                          path={mdiPageLayoutHeaderFooter}
                          title='Element Layout 50'
                          size={1.25}
                          horizontal
                          vertical
                          rotate={90}
                          color='gray'
                          data-tip='Element Layout 50%'
                        />
                      </button>
                      <button
                        className='noStyleButton'
                        onClick={() => updateElementLayout('75', index)}>
                        <Icon
                          path={mdiPageLayoutHeader}
                          title='Element Layout 75'
                          size={1.25}
                          horizontal
                          vertical
                          rotate={-90}
                          color='gray'
                          data-tip='Element Layout 75%'
                        />
                      </button>
                      <button
                        className='noStyleButton'
                        onClick={() => updateElementLayout('100', index)}>
                        <Icon
                          path={mdiTablet}
                          title='Element Layout 100'
                          size={1.25}
                          horizontal
                          vertical
                          rotate={0}
                          color='gray'
                          data-tip='Element Layout 100%'
                        />
                      </button>
                      <button
                        className='noStyleButton'
                        onClick={() => updateElementLayout(null, index)}>
                        <Icon
                          path={mdiBackspaceOutline}
                          title='Element Layout entfernen'
                          size={1.25}
                          horizontal
                          vertical
                          rotate={180}
                          color='gray'
                          data-tip='Element Layout entfernen'
                        />
                      </button>
                    </div>
                    <div key={'image' + element.id}>
                      <Image
                        src={getAssetURL(element.image)}
                        alt='Bild zum Blogpost'
                        height={600}
                        width={600}
                        className='object-cover h-full w-full'
                      />
                    </div>
                  </div>
                );
              case 'sectionsComponent':
                const Component = dynamic(
                  () => import(`../_dynamic/${element.component}`),
                  { ssr: false, loading: () => null }
                );
                return (
                  <div
                    key={'component' + element.id}
                    className={cN(
                      overrideFlexItemClass
                        ? overrideFlexItemClass
                        : flexItemClass
                    )}>
                    <Component key={element.id} />
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>
      </SectionWrapper>
    </>
  );
};

type SectionWrapperProps = {
  children: ReactElement;
  colorScheme: ColorScheme;
  title: string;
};

const SectionWrapper = ({
  children,
  colorScheme,
  title,
}: SectionWrapperProps) => {
  return (
    <section className={`py-16 ${colorScheme}`}>
      <section className='sections'>
        <h2
          className={cN(
            'mb-4',
            'px-4',
            `${colorScheme === 'colorSchemeWhite' ? 'text-violet' : ''}`
          )}>
          {title}
        </h2>
        {children}
      </section>
    </section>
  );
};

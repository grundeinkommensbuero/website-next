import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../Layout';
import { Helmet } from 'react-helmet-async';
import {
  Section,
  SectionInner,
  SectionHeader,
  SectionWrapper,
} from '../Layout/Sections';
import * as s from './style.module.less';
import { formatDate } from '../utils';
import OGImage from './blog_og.png';
import { htmlToText } from 'html-to-text';

const BlogPost = ({
  data: {
    wpPost: { title, content, featuredImage, date, tags, excerpt },
    allWpTag,
    contentfulGlobalStuff: { siteTitle },
  },
  location,
}) => {
  const dateObject = new Date(date);
  const tagList = allWpTag.edges.reduce((list, tag) => {
    list[tag.node.id] = tag.node.name;
    return list;
  }, {});

  return (
    <Layout location={location} title={title}>
      <Helmet>
        <title>{title}</title>

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@exbeditionbge" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={htmlToText(excerpt)} />

        {featuredImage && (
          <meta
            property="og:image"
            content={
              featuredImage.node.localFile.childImageSharp.og.images.fallback
                .src
            }
          />
        )}
        {featuredImage && (
          <meta
            name="twitter:image"
            content={
              featuredImage.node.localFile.childImageSharp.og.images.fallback
                .src
            }
          />
        )}
        {!featuredImage && <meta property="og:image" content={OGImage} />}
        {!featuredImage && <meta name="twitter:image" content={OGImage} />}

        <meta name="description" content={htmlToText(excerpt)} />
        <meta property="og:description" content={htmlToText(excerpt)} />
        <meta property="og:title" content={title} />
        <meta property="og:site_name" content={siteTitle} />
        <meta property="article:published_time" content={date} />
        <meta property="og:type" content="article" />
      </Helmet>

      <SectionWrapper>
        <SectionHeader
          backgroundImageSet={
            featuredImage && featuredImage.node.localFile.childImageSharp.hero
          }
          preTitle={
            tags && (
              <ul className={s.tagList}>
                {tags.map(({ id }) => (
                  <li key={id}>#{tagList[id]}</li>
                ))}
              </ul>
            )
          }
          title={<span dangerouslySetInnerHTML={{ __html: title }} />}
          subTitle={
            <time dateTime={dateObject.toISOString()} className={s.date}>
              {formatDate(dateObject)}
            </time>
          }
        />
        <Section>
          {/* {featuredImage && (
          <SectionInner wide={true}>
            <Img fluid={featuredImage.node.localFile.childImageSharp.hero} />
          </SectionInner>
        )} */}
          <SectionInner>
            <div
              className={s.body}
              dangerouslySetInnerHTML={{
                __html: content,
              }}
            />
          </SectionInner>
        </Section>
      </SectionWrapper>
    </Layout>
  );
};

export default BlogPost;

export const pageQuery = graphql`
  query WordpressPostByPath($path: String!) {
    wpPost(uri: { eq: $path }) {
      title
      content
      excerpt
      date
      featuredImage {
        node {
          localFile {
            childImageSharp {
              hero: gatsbyImageData(placeholder: NONE, layout: FULL_WIDTH)
              og: gatsbyImageData(
                width: 1200
                quality: 90
                placeholder: BLURRED
                layout: FIXED
              )
            }
          }
          uri
        }
      }
    }
    allWpTag {
      edges {
        node {
          id
          name
        }
      }
    }
    contentfulGlobalStuff(contentful_id: { eq: "3mMymrVLEHYrPI9b6wgBzg" }) {
      siteTitle
    }
  }
`;

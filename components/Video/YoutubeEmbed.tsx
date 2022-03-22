import s from './style.module.scss';

export const YoutubeEmbed = ({ embedId }: { embedId: string }) => {
  return (
    <div className={s.youtubeContainer}>
      <iframe
        title="Youtube Embed"
        width="560"
        height="315"
        src={`https://www.youtube-nocookie.com/embed/${embedId}?rel=0`}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      ></iframe>
    </div>
  );
};

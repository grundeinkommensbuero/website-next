import s from './style.module.scss';

type Ratio = '16-9' | 'phone' | null;

export const YoutubeEmbed = ({
  embedId,
  ratio,
}: {
  embedId: string;
  ratio: string;
}) => {
  // this code was suggested by ChatGPT, I'm not sure if it's really neccessary
  const allowedRatios: Ratio[] = ['16-9', 'phone'];
  const safeRatio: Ratio = allowedRatios.includes(ratio as Ratio)
    ? (ratio as Ratio)
    : '16-9';

  return (
    <div className={s.youtubeContainer}>
      <div className={safeRatio === 'phone' ? s.ratioPhone : s.ratio16to9}>
        <iframe
          title="Youtube Embed"
          src={`https://www.youtube-nocookie.com/embed/${embedId}?rel=0`}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

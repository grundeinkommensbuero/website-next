import { CTAButton } from '../../Forms/CTAButton';
import s from './style.module.scss';

export const InstagramShareInstructions = () => {
  const downloadImage = (image: { url: string; filename: string }) => {
    fetch(image.url, {
      method: 'GET',
      headers: {},
    })
      .then(response => {
        response.arrayBuffer().then(function (buffer) {
          const url = window.URL.createObjectURL(new Blob([buffer]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', image.filename); //or any other extension
          document.body.appendChild(link);
          link.click();
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div className={s.instagramShareInstructions}>
      <h3>So teilst du über Instagram:</h3>
      <p>
        Teile die Expedition über deine Insta-Story und zeige all deinen
        Freundinnen, dass du dabei bist. Schau direkt auf unserer Instagram
        Seite vorbei. Dort haben wir einige Posts und Stories zum teilen
        zusammengestellt.
      </p>

      <CTAButton
        onClick={() =>
          window.open(
            'https://www.instagram.com/tv/CN7reFmqrVc/?igshid=1gc54jw6cni9p',
            '_blank'
          )
        }
        className={s.instaStoryButton}
      >
        Zu unserer Insta-Story
      </CTAButton>

      <p>
        Oder einfach Datei runterladen, in deine Insta-Story einfügen und
        @hamburg.testet.grundeinkommen verlinken.
      </p>

      <div className={s.instaImageContainer}>
        <button
          className={s.imageButton}
          onClick={() =>
            downloadImage({
              url: 'https://images.ctfassets.net/af08tobnb0cl/15Vjd0mpP0FpMwmgvP5RHw/1ceaf02a8a52c1bd0d779e9281a552a9/Launch_Story_Ich_bin_dabei.jpg?h=1000',
              filename: 'Launch_Story_Ich_bin_dabei.jpg',
            })
          }
          aria-label="Bild herunterladen"
        >
          <img
            className={s.sharePicInstagram}
            src="https://images.ctfassets.net/af08tobnb0cl/15Vjd0mpP0FpMwmgvP5RHw/1ceaf02a8a52c1bd0d779e9281a552a9/Launch_Story_Ich_bin_dabei.jpg?h=1000"
            alt="sharepic"
          />
        </button>
        <button
          className={s.imageButton}
          onClick={() =>
            downloadImage({
              url: 'https://images.ctfassets.net/af08tobnb0cl/4f7aQbZP37iUc0H0od4BAQ/c76cc9f24ef9970fffcd552ef6c45c5e/Launch_Story_Ich_bin_dabei_Nominierung.jpg?h=1000',
              filename: 'Launch_Story_Ich_bin_dabei_Nominierung.jpg',
            })
          }
          aria-label="Bild herunterladen"
        >
          <img
            className={s.sharePicInstagram}
            src="https://images.ctfassets.net/af08tobnb0cl/4f7aQbZP37iUc0H0od4BAQ/c76cc9f24ef9970fffcd552ef6c45c5e/Launch_Story_Ich_bin_dabei_Nominierung.jpg?h=1000"
            alt="sharepic"
          />
        </button>
      </div>
    </div>
  );
};

export default InstagramShareInstructions;

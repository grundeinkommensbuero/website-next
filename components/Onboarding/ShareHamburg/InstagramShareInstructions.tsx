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
      <h2>Teile die Kampagne auf Instagram!</h2>
      <p>
        Wir haben da was für dich vorbereitet: Lade dir einfach diese Kachel
        herunter, poste sie als Story, und tagge drei Menschen, die vom
        Volksentscheid erfahren sollten!
      </p>

      <div className={s.instaImageContainer}>
        <h3>1. Kachel runterladen:</h3>
        <button
          className={s.imageButton}
          onClick={() =>
            downloadImage({
              url: 'https://directus.volksentscheid-grundeinkommen.de/assets/45431b3b-485f-4380-acf9-e15c87fbef05',
              filename: 'Hamburg-testet-Grundeinkommen_Insta-Story.jpg',
            })
          }
          aria-label="Bild herunterladen"
        >
          <img
            className={s.sharePicInstagram}
            src="https://directus.volksentscheid-grundeinkommen.de/assets/45431b3b-485f-4380-acf9-e15c87fbef05"
            alt="sharepic"
          />
        </button>
      </div>

      <div className={s.instaImageContainer}>
        <h3>2. In deiner Story teilen</h3>
        <CTAButton
          onClick={() =>
            window.open(
              'https://www.instagram.com/hamburg.testet.grundeinkommen/',
              '_blank'
            )
          }
          className={s.instaStoryButton}
        >
          Hier geht es zu Instagram
        </CTAButton>
      </div>
    </div>
  );
};

export default InstagramShareInstructions;

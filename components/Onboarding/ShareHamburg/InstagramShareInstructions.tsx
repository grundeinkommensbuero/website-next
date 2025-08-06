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
      <h3>Teile die Kampagne auf Instagram!</h3>
      <p>
        Wir haben da was für dich vorbereitet: Lade dir einfach diese Kachel
        herunter, poste sie als Story, und tagge drei Menschen, die vom
        Volksentscheid erfahren sollten!
      </p>

      <div className={s.instaImageContainer}>
        <button
          className={s.imageButton}
          onClick={() =>
            downloadImage({
              url: 'https://directus.volksentscheid-grundeinkommen.de/assets/45431b3b-485f-4380-acf9-e15c87fbef05?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE4ZmY0YzExLWFlNjQtNDkxMC05OTg0LTZkMDRiOTA4MWVjNSIsInJvbGUiOiJiMTczZTkzZS03NWQ1LTRiN2QtYjE3NC1hZTM0NjQ4MTQxMDEiLCJhcHBfYWNjZXNzIjp0cnVlLCJhZG1pbl9hY2Nlc3MiOnRydWUsImlhdCI6MTc1NDQ5NDI2MywiZXhwIjoxNzU0NDk1MTYzLCJpc3MiOiJkaXJlY3R1cyJ9.moRSUEraJvnbCYT15Z317mLQr0BDcBhVBJoeNwTiVYI',
              filename: 'Hamburg-testet-Grundeinkommen_Insta-Story.jpg',
            })
          }
          aria-label="Bild herunterladen"
        >
          <img
            className={s.sharePicInstagram}
            src="https://directus.volksentscheid-grundeinkommen.de/assets/45431b3b-485f-4380-acf9-e15c87fbef05?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE4ZmY0YzExLWFlNjQtNDkxMC05OTg0LTZkMDRiOTA4MWVjNSIsInJvbGUiOiJiMTczZTkzZS03NWQ1LTRiN2QtYjE3NC1hZTM0NjQ4MTQxMDEiLCJhcHBfYWNjZXNzIjp0cnVlLCJhZG1pbl9hY2Nlc3MiOnRydWUsImlhdCI6MTc1NDQ5NDI2MywiZXhwIjoxNzU0NDk1MTYzLCJpc3MiOiJkaXJlY3R1cyJ9.moRSUEraJvnbCYT15Z317mLQr0BDcBhVBJoeNwTiVYI"
            alt="sharepic"
          />
        </button>
      </div>

      <CTAButton
        onClick={() =>
          window.open(
            'https://www.instagram.com/tv/CN7reFmqrVc/?igshid=1gc54jw6cni9p',
            '_blank'
          )
        }
        className={s.instaStoryButton}
      >
        Hier geht's zu Instagram
      </CTAButton>
    </div>
  );
};

export default InstagramShareInstructions;

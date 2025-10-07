import { faCheck, faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import s from './style.module.scss';

export const CopyShareMessageBox = ({
  shareMessage,
}: {
  shareMessage: string;
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section>
      <div className={s.copyBox}>
        <pre className={s.shareText}>{shareMessage}</pre>
        <button className={s.copyButton} onClick={copyToClipboard}>
          {copied ? (
            <>
              <FontAwesomeIcon
                icon={faCheck}
                style={{ marginRight: '0.4rem' }}
              />
              Kopiert!
            </>
          ) : (
            <>
              <FontAwesomeIcon
                icon={faCopy}
                style={{ marginRight: '0.4rem' }}
              />
              Text kopieren
            </>
          )}
        </button>
      </div>
    </section>
  );
};

export default CopyShareMessageBox;

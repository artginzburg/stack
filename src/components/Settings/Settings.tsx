import { useState } from 'react';
import GitInfo from 'react-git-info/macro';

import { useTheme } from '../../contexts/ThemeContext';
import { ReactComponent as SettingsIcon } from '../../images/settings.svg';
import { resetButtonStyles } from '../../tools/stylesToolkit';
import { repoUrl } from '../../shared/metaInfo';
import { ModalDefault } from '../ModalDefault';
import './Settings.css';
import { ServiceWorkerUpdateChecker } from '../ServiceWorkerUpdateChecker';

export function Settings({ className }: { className: string }) {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <>
      {isOpened ? (
        <SettingsModal setIsOpened={setIsOpened} />
      ) : (
        <SettingsOpenButton
          className={className}
          onClick={() => {
            setIsOpened(true);
          }}
        />
      )}
    </>
  );
}

const gitInfo = GitInfo();
const gitCommitDate = new Date(gitInfo.commit.date);

const currentDate = new Date();

const usLocale = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
  hour12: false,
});

const gitCommitDateAsString = usLocale
  .format(gitCommitDate)
  .replace(`, ${currentDate.getFullYear()}`, '');

/** @todo adapt to horizontal orientation on mobiles. This applies to all of the game UI, not just this modal. */
export function SettingsModal({
  setIsOpened,
}: {
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  /** @todo dedupe everywhere. Put into a package? Right with the other useful stuff like tel: and mailto: links. */
  const openInNewTabProps: Pick<JSX.IntrinsicElements['a'], 'target' | 'rel'> = {
    target: '_blank',
    rel: 'noreferrer',
  };

  return (
    <ModalDefault setIsOpened={setIsOpened}>
      <p style={{ margin: 0 }}>
        Version{' '}
        <a
          href={`${repoUrl.href}/commit/${gitInfo.commit.hash}`}
          {...openInNewTabProps}
          style={{
            textDecoration: 'none',
            background: '#c8c8c8', // copied from the background-color of .modalDefaultCloseButton
            color: '#000',
            padding: '0.05rem 0.2rem',
            borderRadius: '0.4rem',
            textTransform: 'none',
          }}
        >
          {gitInfo.commit.shortHash}
        </a>
      </p>
      <p style={{ margin: 0, marginTop: '0.5rem' }}>
        released on:{' '}
        <span
          style={{
            color: '#c8c8c8', // copied from the background-color of .modalDefaultCloseButton
          }}
        >
          {gitCommitDateAsString}
        </span>
      </p>
      <ServiceWorkerUpdateChecker />
    </ModalDefault>
  );
}

export function SettingsOpenButton({
  className,
  onClick,
}: {
  className: string;
  onClick: React.DOMAttributes<HTMLButtonElement>['onClick'];
}) {
  const { theme } = useTheme();

  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
      style={{
        ...resetButtonStyles,

        position: 'fixed',
        fontSize: 0,
        bottom: '4.8rem',
        right: '1.9rem',
      }}
    >
      <SettingsIcon
        className="settings-button"
        height={45}
        width={45}
        // @ts-expect-error custom CSS property
        style={{ '--theme-light-elements': theme.lightElements, cursor: 'pointer' }}
      />
    </button>
  );
}

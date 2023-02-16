import './Greeting.css';

import { useMemo, useState } from 'react';

import packageJson from '../../../package.json';
import { tapOrClickBefore } from '../../shared/texts';
import { HowToPlay } from '../HowToPlay';

export const sharedStyleProps: React.CSSProperties = {
  textAlign: 'center',
  width: '100%',

  color: 'white',
  fontWeight: 100,
  letterSpacing: 1,
  fontStretch: '120%',
  textTransform: 'uppercase',

  position: 'fixed',
};

export function Greeting({ index, isStarted }: { index: number; isStarted: boolean }) {
  const [shouldDisplay, setShouldDisplay] = useState(true);

  if (!isStarted && !shouldDisplay) {
    setShouldDisplay(true);
  }
  if (!shouldDisplay) return null;
  if (index > 2) return null;

  if (isStarted || index) {
    if (shouldDisplay) {
      setTimeout(() => {
        setShouldDisplay(false);
      }, 500);
    }
  }

  const headingTop = 5;
  const headingSize = 4;

  const className = ['greeting', isStarted || index ? 'fadeOut' : null].filter(Boolean).join(' ');

  return (
    <>
      <div
        className={className}
        style={{
          ...sharedStyleProps,
          fontSize: `${headingSize}rem`,
          top: `${headingTop}rem`,
        }}
      >
        stack
      </div>
      <div
        className={className}
        style={{
          ...sharedStyleProps,
          animationDelay: '0.2s',
          animationDuration: '0.25s',
          fontSize: '1rem',
          top: `${headingTop + headingSize + 2}rem`,
        }}
      >
        {tapOrClickBefore} to start
      </div>
      <HowToPlay className={className} />
      <GreetingLinks className={className} />
    </>
  );
}

function GreetingLinks({ className }: { className: string }) {
  const repoUrl = useMemo(() => new URL(`https://github.com/${packageJson.repository}`), []);
  const authorUrl = useMemo(() => new URL(new URL(packageJson.homepage).origin), []);

  const repoDomainWithoutLevelOne = useMemo(() => getDomainWithoutLevel(repoUrl), [repoUrl]);

  return (
    <div
      className={className + ' links'}
      style={{
        ...sharedStyleProps,
        fontWeight: 300,
        fontStretch: '100%',
        letterSpacing: 0.5,
        textTransform: 'none',

        fontSize: '0.7rem',
        right: '1rem',
        bottom: '1rem',
        textAlign: 'right',
        zIndex: 1,
      }}
    >
      <a href={repoUrl.href}>{repoDomainWithoutLevelOne}</a> /{' '}
      <a href={authorUrl.href} target="_blank" rel="noreferrer">
        {authorUrl.hostname}
      </a>
    </div>
  );
}

function getDomainWithoutLevel(url: URL | string, stripLevel = 1): string {
  return (url instanceof URL ? url.hostname : url).split('.').slice(0, -stripLevel).join('.');
}

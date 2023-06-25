import './Greeting.css';

import { useMemo, useState } from 'react';

import packageJson from '../../../package.json';
import { tapOrClickBefore } from '../../shared/texts';
import { useTheme } from '../../contexts/ThemeContext';
import { HowToPlay } from '../HowToPlay';
import { useIsFirstVisitInSession } from '../../features/firstVisitInSession';

/** @todo rename to sharedTextProps */
export const sharedStyleProps: React.CSSProperties = {
  textAlign: 'center',
  width: '100%',

  fontWeight: 100,
  letterSpacing: 2.5,
  textTransform: 'uppercase',

  position: 'fixed',
};

export function Greeting({ index, isStarted }: { index: number; isStarted: boolean }) {
  const { theme } = useTheme();

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

  const fadeOutClassName = isStarted || index ? 'fadeOut' : null;
  const className = ['greeting', fadeOutClassName].filter(Boolean).join(' ');

  return (
    <>
      <GreetingTitle
        fadeOutClassName={fadeOutClassName}
        headingSize={headingSize}
        headingTop={headingTop}
      />
      <div
        className={className}
        style={{
          ...sharedStyleProps,
          color: theme.lightElements,
          animationDelay: '0.2s',
          animationDuration: '0.25s',
          fontSize: '1rem',
          top: `${headingTop + headingSize + 2}rem`,
          letterSpacing: 1,

          pointerEvents: 'none',
        }}
      >
        {tapOrClickBefore} to start
      </div>
      <HowToPlay className={className} />
      <GreetingLinks className={className} />
    </>
  );
}

function GreetingTitle({
  fadeOutClassName,
  headingSize,
  headingTop,
}: {
  fadeOutClassName: string | null;
  headingSize: number;
  headingTop: number;
}) {
  const { theme } = useTheme();

  const { isFirstVisitInSession } = useIsFirstVisitInSession();

  const title = 'stack';
  const slowDown = isFirstVisitInSession;

  return (
    <div
      className={['greetingTitleContainer', fadeOutClassName].filter(Boolean).join(' ')}
      style={{
        ...sharedStyleProps,
        width: undefined,
        // position: undefined,
        left: '50%', // to center even with position: fixed;
        transform: 'translateX(-50%)', // to center even with position: fixed;

        color: theme.lightElements,
        fontSize: `${headingSize}rem`,
        top: `${headingTop}rem`,

        // @ts-expect-error valid custom CSS property
        '--animationDuration': slowDown ? '4s' : undefined,

        pointerEvents: 'none',
      }}
    >
      <p>{title}</p>
      <span data-text={title}></span>
      <span data-text={title}></span>
    </div>
  );
}

const isOnSubDomain = true;

function GreetingLinks({ className }: { className: string }) {
  const { theme } = useTheme();

  const repoUrl = useMemo(() => new URL(`https://github.com/${packageJson.repository}`), []);
  const authorUrl = useMemo(() => {
    if (!isOnSubDomain) return new URL(new URL(packageJson.homepage).origin);

    const theUrl = new URL(packageJson.homepage);

    const separator = '.';
    const hostnameSplitByDot = theUrl.hostname.split(separator);
    hostnameSplitByDot.shift();
    theUrl.hostname = hostnameSplitByDot.join(separator);
    return theUrl;
  }, []);

  const repoDomainWithoutLevelOne = useMemo(() => getDomainWithoutLevel(repoUrl), [repoUrl]);

  return (
    <div
      className={className + ' links'}
      style={{
        ...sharedStyleProps,
        color: theme.lightElements,
        fontWeight: 300,
        letterSpacing: 0.5,
        textTransform: 'none',

        fontSize: '0.8rem',
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

import './HowToPlay.css';

import { useState } from 'react';

import { useTheme } from '../../contexts/ThemeContext';
import { ReactComponent as IllustrationGameOver } from '../../images/illustration_game-over.svg';
import { ReactComponent as IllustrationTapToStack } from '../../images/illustration_tap-to-stack.svg';
import { resetButtonStyles } from '../../tools/stylesToolkit';

export function HowToPlay({ className }: { className: string }) {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <>
      {isOpened ? (
        <HowToPlayModal setIsOpened={setIsOpened} />
      ) : (
        <HowToPlayOpenButton
          className={className}
          onClick={() => {
            setIsOpened(true);
          }}
        />
      )}
    </>
  );
}

/** @todo adapt to horizontal orientation on mobiles. This applies to all of the game UI, not just this modal. */
function HowToPlayModal({
  setIsOpened,
}: {
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const sharedFontStyle: React.CSSProperties = {};

  return (
    <div
      className="howToPlayContainer"
      onClick={(event) => {
        const isDirectClickOnBackground = event.currentTarget === event.target;
        if (isDirectClickOnBackground) {
          setIsOpened(false);
        }
      }}
    >
      <section
        style={{
          background: 'black',
          color: 'white',
          paddingTop: '5vmin',
          paddingLeft: '4vmin',
          paddingRight: '4vmin',
          paddingBottom: '7vmin',
          borderRadius: '1.7vmin',

          textTransform: 'uppercase',
          textAlign: 'center',
          fontWeight: 200,

          width: '63%',
          maxWidth: 300,

          position: 'relative',
        }}
      >
        <button
          className="howToPlayCloseButton"
          style={{
            ...resetButtonStyles,
            cursor: 'pointer',
            background: undefined,

            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: '40%',

            borderRadius: '100%',
            width: 'min(6.6vmin, 50px)',
            height: 'min(6.6vmin, 50px)',

            position: 'absolute',
            top: '-3.3vmin',
            right: '-3vmin',
          }}
          onClick={() => {
            setIsOpened(false);
          }}
        ></button>
        <h2
          style={{
            margin: 0,
            padding: 0,
            fontWeight: 200,
            fontSize: 'min(7.5vmin, 35px)',
            ...sharedFontStyle,
          }}
        >
          how to play
        </h2>
        <HowToPlayFigure
          Illustration={IllustrationTapToStack}
          text={'tap to stack'}
          sharedFontStyle={sharedFontStyle}
          figureStyle={{
            marginTop: '4%',
          }}
        />
        <HowToPlayFigure
          Illustration={IllustrationGameOver}
          text={
            <>
              too early / too late
              <br /> = game over
            </>
          }
          sharedFontStyle={sharedFontStyle}
          figureStyle={{
            marginTop: '8%',
          }}
        />
      </section>
    </div>
  );
}

function HowToPlayFigure({
  Illustration,
  text,
  sharedFontStyle,
  figureStyle,
}: {
  Illustration: React.FC<React.SVGProps<SVGSVGElement>>;
  text: React.ReactElement | string;
  sharedFontStyle: React.CSSProperties;
  figureStyle?: React.CSSProperties;
}) {
  return (
    <figure
      style={{
        margin: 0,
        borderTop: 'min(0.6vmin, 1.5px) solid white',
        paddingTop: '6%',
        ...figureStyle,
      }}
    >
      <Illustration style={{ width: '80%', maxWidth: 200, height: 'auto' }} />
      <figcaption style={{ fontSize: 'min(4.9vmin, 23px)', marginTop: '5%', ...sharedFontStyle }}>
        {text}
      </figcaption>
    </figure>
  );
}

function HowToPlayOpenButton({
  className,
  onClick,
}: {
  className: string;
  onClick: React.DOMAttributes<HTMLButtonElement>['onClick'];
}) {
  const { theme } = useTheme();

  const buttonSize = 0.5;

  return (
    <button
      onClick={onClick}
      className={className}
      style={{
        ...resetButtonStyles,
        cursor: 'pointer',

        animationDelay: '0.2s',
        animationDuration: '0.25s',

        position: 'fixed',
        top: 41 * buttonSize,
        left: 41 * buttonSize,

        borderRadius: '100%',
        border: `${theme.lightElements} ${4 * buttonSize}px solid`,
        height: 58 * buttonSize,
        width: 58 * buttonSize,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: theme.lightElements,
        fontSize: 50 * buttonSize,
        fontFamily: `'Lucida Sans', Arial, sans-serif`, // The dot in the bottom of the question mark should be square. Fonts were chosen by that matter.

        zIndex: 1,
      }}
    >
      ?
    </button>
  );
}

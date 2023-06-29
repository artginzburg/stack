import { useState } from 'react';

import { useTheme } from '../../contexts/ThemeContext';
import { ReactComponent as IllustrationGameOver } from '../../images/illustration_game-over.svg';
import { ReactComponent as IllustrationTapToStack } from '../../images/illustration_tap-to-stack.svg';
import { tapOrClickBefore } from '../../shared/texts';
import { resetButtonStyles } from '../../tools/stylesToolkit';
import { ModalDefault } from '../ModalDefault';

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
    <ModalDefault setIsOpened={setIsOpened}>
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
        text={`${tapOrClickBefore} to stack`}
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
    </ModalDefault>
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

  const buttonSizing = 0.5;

  const visualOffsetFromScreenEdge = 35 * buttonSizing;

  const buttonSize = 50 * buttonSizing;

  const padding = buttonSize * 0.6; // Look at https://github.com/artginzburg/stack/issues/22#issue-1780014221 for the explanation on why 60%.

  return (
    <button
      onClick={onClick}
      className={className}
      style={{
        ...resetButtonStyles,
        position: 'fixed',
        top: visualOffsetFromScreenEdge - padding,
        left: visualOffsetFromScreenEdge - padding,

        padding,
      }}
    >
      <div
        style={{
          cursor: 'pointer',

          animationDelay: '0.2s',
          animationDuration: '0.25s',

          borderRadius: '100%',
          border: `${theme.lightElements} ${4 * buttonSizing}px solid`,
          boxSizing: 'border-box',
          height: buttonSize,
          width: buttonSize,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: theme.lightElements,
          fontSize: 42 * buttonSizing,
          paddingTop: 2,
          fontFamily: `'Lucida Sans', Arial, sans-serif`, // The dot in the bottom of the question mark should be square. Fonts were chosen by that matter.

          zIndex: 1,
        }}
      >
        ?
      </div>
    </button>
  );
}

import { resetButtonStyles } from '../../tools/stylesToolkit';
import './ModalDefault.css';

export function ModalDefault({
  children,
  setIsOpened,
}: React.PropsWithChildren<{
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>;
}>) {
  return (
    <div
      className="modalDefaultContainer"
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
          className="modalDefaultCloseButton"
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
        {children}
      </section>
    </div>
  );
}

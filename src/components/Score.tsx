import { useTheme } from '../contexts/ThemeContext';
import { sharedStyleProps } from './Greeting';

export function Score({ index, isEnded }: { index: number; isEnded: boolean }) {
  const { theme } = useTheme();

  return (
    <div
      style={{
        ...sharedStyleProps,
        color: theme.lightElements,
        fontWeight: 200,
        letterSpacing: -2,

        fontSize: '5rem',
        top: '2rem',

        pointerEvents: 'none',
      }}
    >
      {isEnded ? Number(index) : index || ''}
    </div>
  );
}

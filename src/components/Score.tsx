import { sharedStyleProps } from './Greeting';

export function Score({ index }: { index: number }) {
  return (
    <div
      style={{
        ...sharedStyleProps,
        fontWeight: 200,
        letterSpacing: 0,
        fontStretch: '100%',

        fontSize: '5rem',
        top: '2rem',
      }}
    >
      {index || ''}
    </div>
  );
}

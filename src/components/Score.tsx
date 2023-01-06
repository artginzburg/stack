export function Score({ index }: { index: number }) {
  return (
    <div
      style={{
        textAlign: 'center',
        color: 'white',
        fontSize: '5rem',
        position: 'fixed',
        top: '2rem',
        width: '100%',
      }}
    >
      {index || ''}
    </div>
  );
}

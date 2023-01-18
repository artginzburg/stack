export function ConditionalWrapper({ condition, Wrapper, children }: ConditionalWrapperProps) {
  if (condition) return <Wrapper>{children}</Wrapper>;
  return <>{children}</>;
}

interface ConditionalWrapperProps {
  condition: boolean;
  Wrapper: (props: React.PropsWithChildren) => React.ReactElement;
  children: React.ReactNode;
}

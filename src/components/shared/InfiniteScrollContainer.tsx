import { useInView } from "react-intersection-observer";

// TYPE
interface InfiniteScrollContainerProps extends React.PropsWithChildren {
  onBottomReached: () => void;
  className?: string;
}

// INFINITE SCROLL CONTAINER
export default function InfiniteScrollContainer({
  children,
  onBottomReached,
  className,
}: InfiniteScrollContainerProps) {
  // REF TO GET THE POSITION OF THE USER ON THE SCREEN
  const { ref } = useInView({
    rootMargin: "200px",
    onChange(inView) {
      if (inView) {
        onBottomReached();
      }
    },
  });

  // RETURN THE CONTAINER
  return (
    <div className={className}>
      {children}
      <div ref={ref} />
    </div>
  );
}

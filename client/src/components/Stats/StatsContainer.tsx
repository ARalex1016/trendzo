export const StatsContainer = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={`grid grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

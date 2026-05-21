export const StatsContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">{children}</div>
  );
};

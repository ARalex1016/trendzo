import type React from "react";

export const Title = ({ text }: { text: string }) => {
  return <h2 className="text-xl font-semibold">{text}</h2>;
};

export const BaseText = ({ children }: { children: React.ReactNode }) => {
  return <p className="text-foreground/60">{children}</p>;
};

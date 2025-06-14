import { Link } from "react-router";
import { Button } from "./ui/button";
import React from "react";

type MainButtonProps = React.ComponentProps<typeof Button> & {
  children: React.ReactNode;
  linkTo?: string;
};

export function MainButton({ children, linkTo, ...props }: MainButtonProps) {
  const button = (
    <Button className="w-full h-16 font-bold text-xl" {...props}>
      {children}
    </Button>
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-1 shadow-black shadow-2xl p-4">
      {linkTo ? <Link to={linkTo}>{button}</Link> : button}
    </div>
  );
}

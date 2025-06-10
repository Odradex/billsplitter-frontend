import { Link } from "react-router";
import { Button } from "./ui/button";

import React from "react";

type MainButtonProps = {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  linkTo?: string;
};

export function MainButton({ children, onClick, linkTo }: MainButtonProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4">
      <Link to={linkTo || ''}>
        <Button className="w-full h-16 font-bold text-xl" onClick={onClick}>{children}</Button>
      </Link>
    </div>
  )
}

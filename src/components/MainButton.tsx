import { Button } from "./ui/button";

import React from "react";

export function MainButton({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
      <Button className="w-full h-16 font-bold text-xl">{children}</Button>
    </div>
  )
}

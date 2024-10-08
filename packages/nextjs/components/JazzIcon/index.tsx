import React, { memo, useEffect, useRef } from "react";
import jazzicon from "@metamask/jazzicon";

interface JazzIconProps {
  diameter: number;
  seed: number;
}

export const JazzIcon = memo(({ diameter, seed }: JazzIconProps) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref?.current) {
      const icon = jazzicon(diameter, seed);

      ref.current.replaceChildren(icon);
    }
  }, [diameter, ref, seed]);

  return <span ref={ref}></span>;
});
JazzIcon.displayName = "JazzIcon";

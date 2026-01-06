import { err } from "@tsly/core";
import { maybe } from "@tsly/maybe";
import { useAnimationFrame } from "framer-motion";
import { type HTMLAttributes, useRef, useState } from "react";

export const Wobble = (
  props: Omit<HTMLAttributes<HTMLDivElement>, "onMouseMove" | "onMouseLeave">
) => {
  const CONSTRAINT = 200;
  const ref = useRef<HTMLDivElement>(null);

  const [bendX, setBendX] = useState(0);
  const [bendY, setBendY] = useState(0);

  useAnimationFrame(() => {
    maybe(ref.current)?.let(it => {
      it.style.transform = `perspective(100px) rotateX(${bendX}deg) rotateY(${bendY}deg)`;
    });
  });

  return (
    <div
      {...props}
      ref={ref}
      onMouseMove={e => {
        const box: DOMRect =
          ref.current?.getBoundingClientRect() ?? err("unmounted ref");

        const calcX = -(e.clientY - box.y - box.height / 2) / CONSTRAINT;
        const calcY = (e.clientX - box.x - box.width / 2) / CONSTRAINT;

        setBendX(calcX);
        setBendY(calcY);
      }}
      onMouseLeave={() => {
        setBendX(0);
        setBendY(0);
      }}
    />
  );
};

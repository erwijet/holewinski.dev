import { createMarkerComponent, createSlots } from "@/utils/slots";
import { err } from "@tsly/core";
import { useAnimationFrame } from "framer-motion";
import { type HTMLAttributes, useRef, useState } from "react";

const LayerMarker = createMarkerComponent();

const Layer = (
  props: HTMLAttributes<HTMLDivElement> & { bendX: number; bendY: number }
) => {
  const ref = useRef<HTMLDivElement>(null);

  useAnimationFrame(() => {
    if (!ref.current) return;
    ref.current.style.transform = `rotateX(${props.bendX}deg) rotateY(${props.bendY}deg) translateX(${props.bendY}px) translateY(${props.bendX}px)`;
    ref.current.style.transformOrigin = "center";
    ref.current.style.willChange = "transform";
  });

  return <div ref={ref} {...props} />;
};

export const Parallax = Object.assign(
  ({
    children,
    ...props
  }: Omit<HTMLAttributes<HTMLDivElement>, "onMouseMove" | "onMouseLeave"> & {
    constraint?: number;
  }) => {
    const CONSTRAINT = props.constraint ?? 200;
    const ref = useRef<HTMLDivElement>(null);

    const [bendX, setBendX] = useState(0);
    const [bendY, setBendY] = useState(0);

    const slots = createSlots(children, { ParallaxLayer: LayerMarker });

    return (
      <div
        {...props}
        ref={ref}
        className="grid [perspective:100px]"
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
      >
        {slots.ParallaxLayer.map((layer, i) => {
          const t = i / Math.max(1, slots.ParallaxLayer.length - 1); // normalize from 0..1
          const depth = 0.25 + 0.75 * t;

          return (
            <Layer
              key={i}
              bendX={bendX * depth}
              bendY={bendY * depth}
              className="col-start-1 row-start-1"
            >
              {layer}
            </Layer>
          );
        })}
      </div>
    );
  },
  { Layer: LayerMarker }
);

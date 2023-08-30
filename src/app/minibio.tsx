import { TypeAnimation } from "react-type-animation";
import site from "@/site.json";

export const MiniBio = () => (
  <TypeAnimation
    sequence={site.bios
      .sort(() => (Math.random() < 0.5 ? -1 : 1)) // shuffle
      .flatMap((bio) => [`Software Engineer & ${bio}`, 5000])}
    repeat={Infinity}
    speed={40}
    deletionSpeed={80}
  />
);

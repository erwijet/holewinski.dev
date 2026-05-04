import { Parallax } from "@/components/Parallax";
import Avatar from "../assets/images/avatar.png";

export const TylerParallax = () => (
  <Parallax>
    <Parallax.Layer>
      <img
        src={Avatar.src}
        alt="Profile"
        className="aspect-square rounded-md object-cover sm:w-[300px]"
      />
    </Parallax.Layer>
  </Parallax>
);

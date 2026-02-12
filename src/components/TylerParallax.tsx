import Layer1 from "../assets/images/tyler-parallax-layer-1.png";
import Layer2 from "../assets/images/tyler-parallax-layer-2.png";
import { Parallax } from "@/components/Parallax";

export const TylerParallax = () => (
  <Parallax>
    <Parallax.Layer>
      <img
        src={Layer2.src}
        alt="Profile"
        className="aspect-square rounded-md object-cover sm:w-[300px]"
      />
    </Parallax.Layer>
    <Parallax.Layer>
      <img
        src={Layer1.src}
        alt="Profile"
        className="aspect-square rounded-md object-cover sm:w-[300px]"
      />
    </Parallax.Layer>
  </Parallax>
);


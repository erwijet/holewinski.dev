import type { Props } from "astro";
import IconMail from "@/assets/icons/IconMail.svg";
import IconGitHub from "@/assets/icons/IconGitHub.svg";
import IconLinkedin from "@/assets/icons/IconLinkedin.svg";
import IconSpotify from "@/assets/icons/IconSpotify.svg";
import IconLastFM from "@/assets/icons/IconLastFM.svg";
import IconDiscord from "@/assets/icons/IconDiscord.svg";
import { SITE } from "@/config";

interface Social {
  name: string;
  href: string;
  linkTitle: string;
  icon: (_props: Props) => Element;
}

export const SOCIALS: Social[] = [
  {
    name: "GitHub",
    href: "https://github.com/erwijet",
    linkTitle: `${SITE.title} on GitHub`,
    icon: IconGitHub,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/tylerholewinski/",
    linkTitle: `Tyler Holewinski on LinkedIn`,
    icon: IconLinkedin,
  },
  {
    name: "Spotify",
    href: "https://goto.holewinski.dev/spotify",
    linkTitle: "Spotify",
    icon: IconSpotify,
  },
  {
    name: "Discord",
    href: "https://discord.com/users/425426311666991114",
    linkTitle: "Discord",
    icon: IconDiscord
  },
  {
    name: "LastFM",
    href: "https://last.fm/user/erwijet",
    linkTitle: "Last FM",
    icon: IconLastFM,
  },
  {
    name: "Mail",
    href: "mailto:tyler@holewinski.dev",
    linkTitle: `Send an email to Tyler Holewinski`,
    icon: IconMail,
  },
] as const;

import { Button } from "@nextui-org/button";
import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { NavBar } from "~/shared/NavBar";
import { TypeAnimation } from "react-type-animation";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

function getFormattedTimeBetween(d1: Date, d2: Date): string {
  const millisecondsPerMonth = 30.44 * 24 * 60 * 60 * 1000; // appx

  const delta = d2.getTime() - d1.getTime();

  const years = Math.floor(delta / (millisecondsPerMonth * 12));
  const months = Math.floor(
    (delta % (millisecondsPerMonth * 12)) / millisecondsPerMonth
  );

  return `${
    years == 1 ? years + " year " : years > 1 ? years + " years " : ""
  }${months == 1 ? months + " month" : months > 1 ? months + " months" : ""}`;
}

export const loader = () => {
  return {
    roles: [
      {
        name: "Bryx",
        link: "https://bryx.com",
        bio: "At Bryx, I work with a small team to bring a cloud-based solution to first responders and their agencies by building software that integrate all aspects of the incident lifecycle, from dispatch to alerting and reporting.",
        title: "Software Engineer",
        start: new Date("05/25/22"),
        end: null,
      },
      {
        name: "RIT ITS",
        link: "",
        bio: "While living on campus I worked at the RIT ITS helpdesk, where I assisted with GSuite/LDAP account management for students and staff, device troubleshooting, and all other level-1 techincal issues for the university.",
        title: "Helpdesk Technition",
        start: new Date("09/10/22"),
        end: new Date("05/25/22"),
      },
    ],
    bios: [
      "Coffee Enjoyer",
      "Plant Collector",
      "Vim Lobbyist",
      "Autoheart Fanboy",
      "Factorio Addict",
      "Member of the Apple Walled Garden™",
      "Indietronica Lover",
    ],
  };
};

export default function Index() {
  const { roles, bios } = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-5">
        <div className="max-w-[16rem] flex flex-col md:pl-3 border-y-medium md:border-y-0 text-left md:text-left md:border-l-large py-3 md:py-0 md:rounded-sm border-foreground gap-1 text-foreground text-small italic brightness-110">
          <h1 className="text-4xl font-medium tracking-tight text-white not-italic min-w-max">
            Tyler Holewinski
          </h1>
          <TypeAnimation
            sequence={bios
              .sort(() => (Math.random() < 0.5 ? -1 : 1)) // shuffle
              .flatMap((bio) => [`Software Engineer & ${bio}`, 5000])}
            repeat={Infinity}
            speed={40}
            deletionSpeed={80}
          />
        </div>

        <img
          alt="profile"
          className="aspect-square max-h-56 max-w-56 rounded-md shadow-lg"
          src="/profile.png"
        />
      </div>
    </div>
  );
}

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
} from "@nextui-org/react";

export function NavBar() {
  return (
    <Navbar className="bg-background md:[&>*]:px-0">
      <NavbarContent>
        <NavbarBrand>
          <h1 className="text-xl tracking-tighter">{"// Tyler Holewinski"}</h1>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#">
            Resume
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Source
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Linkedin
          </Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

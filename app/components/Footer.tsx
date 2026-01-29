import { Footer as FlowbiteFooter, FooterCopyright, FooterLink, FooterLinkGroup } from "flowbite-react";

export default function Footer() {
  return (
    <FlowbiteFooter container>
      <FooterCopyright href="/" by="Buildebite™" year={new Date().getFullYear()} />
      <FooterLinkGroup>
        <FooterLink href="#">About</FooterLink>
        <FooterLink href="#">Privacy Policy</FooterLink>
        <FooterLink href="#">Licensing</FooterLink>
        <FooterLink href="#">Contact</FooterLink>
      </FooterLinkGroup>
    </FlowbiteFooter>
  );
}
import { Container } from "../container";

export const Navbar = () => {
  return (
    <Container>
      <header className="flex justify-between">
        <h3>FedeCodeLab</h3>
        <ul className="flex gap-4 text-[16px]">
          <li>01. Habilidades</li>
          <li>02. Experiencia</li>
          <li>03. Portfolio</li>
          <li>04. Certificados</li>
        </ul>
      </header>
    </Container>
  );
};

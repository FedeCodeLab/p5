import { Container } from "../container";

export const Footer = () => {
  return (
    <Container>
      <footer className="flex flex-col gap-2 text-center text-[16px]">
        <p className="font-400">
          Hecho con Next.js por Federico Pablo Guzmán · Todos los derechos
          reservados.
        </p>
        <p className="text-[#aaaaaa]">federicoguzman.css@gmail.com</p>
        <div></div>
      </footer>
    </Container>
  );
};

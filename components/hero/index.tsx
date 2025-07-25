import { LinkButton } from "../ui/LinkButton";
import { Container } from "../container";
import { Table } from "./_components";

export const Hero = () => {
  return (
    <Container>
      <section className="flex gap-4">
        <div className="flex flex-col gap-4 w-full">
          <div>
            <p className="bg-light text-xl text-center py-1 px-4 inline-block">
              Presentación
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div>
              <h3>Federico Guzmán</h3>
              <p>Desarrollador Frontend</p>
            </div>
            <p className="max-w-[500px]">
              Desarrollador Front-end enfocado en construir interfaces web
              funcionales, accesibles y de alta calidad. Combino conocimientos
              técnicos con atención al detalle para crear soluciones modernas y
              orientadas a la experiencia del usuario.
            </p>
          </div>

          <div className="flex gap-4">
            <LinkButton href="#">Github</LinkButton>
            <LinkButton href="#">Linkedin</LinkButton>
            <LinkButton href="#">Hablemos</LinkButton>
          </div>
        </div>
        <div className="min-w-[300px] w-[300px] flex flex-col gap-4">
          <div>
            <p className="min-w-[100px] bg-light text-xl inline-block py-1 px-4 text-center">
              Info
            </p>
          </div>

          <div>
            <Table />
          </div>
        </div>
      </section>
    </Container>
  );
};

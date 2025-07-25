import { Item } from "./Item";

export const Table = () => {
  return (
    <table className="border w-full">
      <thead className="border">
        <tr className="border bg-light">
          <Item>Nombre</Item>
          <Item>Federico</Item>
        </tr>
      </thead>
      <tbody>
        <tr>
          <Item>Edad</Item>
          <Item>26</Item>
        </tr>
        <tr>
          <Item>Trabajando en</Item>
          <Item>BeBot</Item>
        </tr>

        <tr>
          <Item>Hace</Item>
          <Item>11 meses</Item>
        </tr>
      </tbody>
    </table>
  );
};

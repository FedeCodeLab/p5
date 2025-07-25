import Link from "next/link";

export const LinkButton = ({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) => {
  return (
    <Link
      href={href}
      className="text-[16px] hover:text-[#aaaaaa] bg-light hover:bg-[#535353] transition-colors duration-300 rounded-[5px] px-4 py-2 text-center"
    >
      <h1>{children}</h1>
    </Link>
  );
};

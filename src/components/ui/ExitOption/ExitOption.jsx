import Link from "next/link";

export default function CloseButton({page}) {
  return (
    <Link
      href={page}
      className="absolute top-18 right-4 text-red-600 hover:text-red-800 text-4xl font-bold mr-2 transition-colors duration-300 ease-in-out "
    >
      ×
    </Link>
  );
}

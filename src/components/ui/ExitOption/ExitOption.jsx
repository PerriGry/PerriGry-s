import Link from "next/link";

export default function CloseButton({page}) {
  return (
    <Link
      href={page}
      className="bg-[#1C2E4A] text-white px-5 py-2 text-sm font-semibold rounded-md hover:bg-[#15233a] transition duration-300 ease-in-out"
    >
      x
    </Link>
  );
}

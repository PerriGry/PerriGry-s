import Image from "next/image";

const logo = "/logo.png"

export default function Header({}) {
  return (
    <header className="w-full h-17 absolute bg-yellow-400 top-0 right-0 justify-between flex">

        <Image src={logo} width={65} height={65} className="rounded-full ml-2" ></Image>
    </header>
  );
}

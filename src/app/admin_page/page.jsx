import { ButtonRegisterUser, ButtonTotalSales, ExitOption} from "@/components/index";

export default function AdminPage() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-8 p-10 justify-items-center place-items-center bg-yellow-200 h-screen relative">
      <ButtonRegisterUser />
      <ButtonTotalSales />
      <ExitOption page="/"/>
    </div>
  );
}

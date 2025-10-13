import { ExitOption, TotalSales } from '@/components/index';

export default function AdminPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-200 p-8 relative">
        <ExitOption  page="/admin_page"/>
        <TotalSales />
    </div>
  );
}
import { RegisterUser, ExitOption } from "@/components/index";

export default function RegisterUserPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-yellow-200 p-8 relative">
            <ExitOption page="/admin_page" />
            <RegisterUser />
        </div>
    );
}


import { getEmployee } from "@/services/auth.service";

export async function GET() {
  try {
    const users = await getEmployee();

    return new Response(
      JSON.stringify({ users }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}

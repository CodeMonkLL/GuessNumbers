import { backendFetch } from "@/lib/backend";

export async function GET() {
  const { status, body } = await backendFetch("/", { method: "GET" });
  return Response.json(body, { status });
}

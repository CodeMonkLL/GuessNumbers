import { backendFetch } from "@/lib/backend";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  const { status, body } = await backendFetch("/reset-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return Response.json(body, { status });
}

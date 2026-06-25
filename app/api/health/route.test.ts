import { GET } from "@/app/api/health/route";

describe("GET /api/health", () => {
  it("returns ok status payload", async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      status: "ok",
      service: "avgst-dev-portal",
    });
    expect(body.checkedAt).toEqual(expect.any(String));
  });
});

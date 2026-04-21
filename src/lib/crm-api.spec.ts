import {
  listClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
  listDeals,
  createDeal,
  updateDeal,
  deleteDeal
} from "./crm-api";

const mockFetch = jest.fn();
global.fetch = mockFetch;

function mockOk(body: unknown, status = 200) {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    status,
    json: () => Promise.resolve(body)
  });
}

function mockError(status: number, body: unknown) {
  mockFetch.mockResolvedValueOnce({
    ok: false,
    status,
    statusText: "Error",
    json: () => Promise.resolve(body)
  });
}

const client = {
  id: "c1",
  name: "Acme",
  email: "a@acme.com",
  phone: null,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
};

const deal = {
  id: "d1",
  title: "Deal",
  amount: 1000,
  status: "NEW",
  clientId: "c1",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  client
};

beforeEach(() => mockFetch.mockClear());

describe("listClients", () => {
  it("calls correct URL with page and limit", async () => {
    mockOk({ data: [client], meta: {} });
    await listClients(2, 5);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/clients?page=2&limit=5"),
      expect.any(Object)
    );
  });

  it("uses defaults page=1 limit=10", async () => {
    mockOk({ data: [], meta: {} });
    await listClients();
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/clients?page=1&limit=10"),
      expect.any(Object)
    );
  });
});

describe("getClient", () => {
  it("calls correct URL", async () => {
    mockOk({ ...client, deals: [] });
    await getClient("c1");
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/clients/c1"),
      expect.any(Object)
    );
  });
});

describe("createClient", () => {
  it("sends POST with body", async () => {
    mockOk(client);
    await createClient({ name: "Acme", email: "a@acme.com" });
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/clients"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ name: "Acme", email: "a@acme.com" })
      })
    );
  });
});

describe("updateClient", () => {
  it("sends PATCH with body", async () => {
    mockOk(client);
    await updateClient("c1", { name: "Updated" });
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/clients/c1"),
      expect.objectContaining({ method: "PATCH" })
    );
  });
});

describe("deleteClient", () => {
  it("sends DELETE", async () => {
    mockOk(client);
    await deleteClient("c1");
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/clients/c1"),
      expect.objectContaining({ method: "DELETE" })
    );
  });
});

describe("listDeals", () => {
  it("calls /deals", async () => {
    mockOk([deal]);
    await listDeals();
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/deals"),
      expect.any(Object)
    );
  });
});

describe("createDeal", () => {
  it("sends POST with body", async () => {
    mockOk(deal);
    await createDeal({ title: "Deal", amount: 1000, clientId: "c1" });
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/deals"),
      expect.objectContaining({ method: "POST" })
    );
  });
});

describe("updateDeal", () => {
  it("sends PATCH", async () => {
    mockOk(deal);
    await updateDeal("d1", { title: "Updated" });
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/deals/d1"),
      expect.objectContaining({ method: "PATCH" })
    );
  });
});

describe("deleteDeal", () => {
  it("sends DELETE", async () => {
    mockOk(deal);
    await deleteDeal("d1");
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/deals/d1"),
      expect.objectContaining({ method: "DELETE" })
    );
  });
});

describe("error handling", () => {
  it("throws with message from API response", async () => {
    mockError(422, { message: "Validation failed" });
    await expect(createClient({ name: "", email: "" })).rejects.toThrow("Validation failed");
  });

  it("joins array messages", async () => {
    mockError(400, { message: ["name is required", "email is invalid"] });
    await expect(createClient({ name: "", email: "" })).rejects.toThrow(
      "name is required, email is invalid"
    );
  });

  it("falls back to statusText when no message", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: () => Promise.reject(new Error("not json"))
    });
    await expect(listDeals()).rejects.toThrow("Internal Server Error");
  });

  it("returns undefined for 204 responses", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, status: 204 });
    const result = await deleteClient("c1");
    expect(result).toBeUndefined();
  });
});

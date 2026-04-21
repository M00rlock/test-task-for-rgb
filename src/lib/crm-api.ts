export const DEAL_STATUSES = ["NEW", "IN_PROGRESS", "WON", "LOST"] as const;

export type DealStatus = (typeof DEAL_STATUSES)[number];

export type ClientSummary = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DealWithClient = {
  id: string;
  title: string;
  amount: number;
  status: DealStatus;
  clientId: string;
  createdAt: string;
  updatedAt: string;
  client: ClientSummary;
};

export type DealWithoutClient = Omit<DealWithClient, "client">;

export type ClientWithDeals = ClientSummary & {
  deals: DealWithoutClient[];
};

export type ClientListResponse = {
  data: ClientSummary[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type CreateClientInput = {
  name: string;
  email: string;
  phone?: string;
};

export type UpdateClientInput = {
  name?: string;
  email?: string;
  phone?: string | null;
};

export type CreateDealInput = {
  title: string;
  amount: number;
  clientId: string;
  status?: DealStatus;
};

export type UpdateDealInput = {
  title?: string;
  amount?: number;
  status?: DealStatus;
  clientId?: string | null;
};

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:3001").replace(
  /\/$/,
  ""
);

async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {})
    }
  });

  if (!response.ok) {
    const payload = await safeParseError(response);
    throw new Error(payload);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

async function safeParseError(response: Response) {
  try {
    const payload = (await response.json()) as { message?: string | string[] };
    if (Array.isArray(payload.message)) {
      return payload.message.join(", ");
    }
    if (typeof payload.message === "string") {
      return payload.message;
    }
  } catch {
    // Fall back to the status text below.
  }

  return response.statusText || "Unknown API error";
}

export function listClients(page = 1, limit = 10) {
  return apiRequest<ClientListResponse>(`/clients?page=${page}&limit=${limit}`);
}

export function getClient(id: string) {
  return apiRequest<ClientWithDeals>(`/clients/${id}`);
}

export function createClient(input: CreateClientInput) {
  return apiRequest<ClientSummary>("/clients", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function updateClient(id: string, input: UpdateClientInput) {
  return apiRequest<ClientSummary>(`/clients/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
}

export function deleteClient(id: string) {
  return apiRequest<ClientSummary>(`/clients/${id}`, {
    method: "DELETE"
  });
}

export function listDeals() {
  return apiRequest<DealWithClient[]>("/deals");
}

export function createDeal(input: CreateDealInput) {
  return apiRequest<DealWithClient>("/deals", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function updateDeal(id: string, input: UpdateDealInput) {
  return apiRequest<DealWithClient>(`/deals/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
}

export function deleteDeal(id: string) {
  return apiRequest<DealWithClient>(`/deals/${id}`, {
    method: "DELETE"
  });
}

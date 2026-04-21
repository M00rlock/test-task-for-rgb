"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  ComponentType,
  FormEvent,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes
} from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  CircleDollarSign,
  Filter,
  PencilLine,
  Plus,
  RefreshCw,
  Trash2,
  Users,
  Clock3,
  Target
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  createClient,
  createDeal,
  DEAL_STATUSES,
  deleteClient,
  deleteDeal,
  listClients,
  listDeals,
  type ClientListResponse,
  type ClientSummary,
  type DealStatus,
  type DealWithClient,
  updateClient,
  updateDeal
} from "@/lib/crm-api";

const CLIENT_PAGE_SIZE = 6;
const SELECT_PAGE_SIZE = 100;

type ClientFormState = {
  name: string;
  email: string;
  phone: string;
};

type DealFormState = {
  title: string;
  amount: string;
  status: DealStatus;
  clientId: string;
};

type StatusFilter = DealStatus | "ALL";

const emptyClientForm: ClientFormState = {
  name: "",
  email: "",
  phone: ""
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

function statusMeta(status: DealStatus) {
  switch (status) {
    case "NEW":
      return {
        label: "New",
        badge: "border-amber-200 bg-amber-50 text-amber-700"
      };
    case "IN_PROGRESS":
      return {
        label: "In progress",
        badge: "border-sky-200 bg-sky-50 text-sky-700"
      };
    case "WON":
      return {
        label: "Won",
        badge: "border-emerald-200 bg-emerald-50 text-emerald-700"
      };
    case "LOST":
      return {
        label: "Lost",
        badge: "border-rose-200 bg-rose-50 text-rose-700"
      };
    default:
      throw new Error(`Unsupported status: ${status}`);
  }
}

function statusCountLabel(count: number) {
  return `${count} deal${count === 1 ? "" : "s"}`;
}

function SectionTitle({
  kicker,
  title,
  description
}: {
  kicker: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">{kicker}</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

function Field({
  label,
  hint,
  children
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-800">{label}</span>
        {hint ? <span className="text-xs text-slate-400">{hint}</span> : null}
      </div>
      {children}
    </label>
  );
}

function FieldInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 ${props.className ?? ""}`}
    />
  );
}

function FieldSelect(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100 ${props.className ?? ""}`}
    />
  );
}

function StatCard({
  icon: Icon,
  title,
  value,
  hint
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/85 p-5 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-700">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-500">{hint}</p>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  text
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/60 p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}

export function CrmDashboard() {
  const [clientPage, setClientPage] = useState(1);
  const [clientsResponse, setClientsResponse] = useState<ClientListResponse | null>(null);
  const [clientOptions, setClientOptions] = useState<ClientSummary[]>([]);
  const [deals, setDeals] = useState<DealWithClient[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [savingClient, setSavingClient] = useState(false);
  const [savingDeal, setSavingDeal] = useState(false);
  const [deletingClientId, setDeletingClientId] = useState<string | null>(null);
  const [deletingDealId, setDeletingDealId] = useState<string | null>(null);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [editingDealId, setEditingDealId] = useState<string | null>(null);
  const [clientForm, setClientForm] = useState<ClientFormState>(emptyClientForm);
  const [dealForm, setDealForm] = useState<DealFormState>({
    title: "",
    amount: "",
    status: "NEW",
    clientId: ""
  });
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [clientFilter, setClientFilter] = useState<string>("ALL");
  const initialLoadRef = useRef(true);

  const refreshData = useCallback(async (page: number) => {
    setError(null);
    if (initialLoadRef.current) {
      setIsInitialLoading(true);
      initialLoadRef.current = false;
    } else {
      setIsRefreshing(true);
    }

    try {
      const [pagedClients, selectableClients, allDeals] = await Promise.all([
        listClients(page, CLIENT_PAGE_SIZE),
        listClients(1, SELECT_PAGE_SIZE),
        listDeals()
      ]);

      if (page > pagedClients.meta.totalPages && pagedClients.meta.totalPages > 0) {
        setClientPage(pagedClients.meta.totalPages);
        return;
      }

      setClientsResponse(pagedClients);
      setClientOptions(selectableClients.data);
      setDeals(allDeals);
      setLastSyncedAt(new Date().toISOString());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load dashboard data");
    } finally {
      setIsInitialLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void refreshData(clientPage);
  }, [clientPage, refreshData]);

  useEffect(() => {
    if (!clientOptions.length) {
      return;
    }

    setDealForm((current) => {
      if (current.clientId && clientOptions.some((client) => client.id === current.clientId)) {
        return current;
      }

      if (editingDealId) {
        return current;
      }

      return {
        ...current,
        clientId: clientOptions[0]?.id ?? ""
      };
    });
  }, [clientOptions, editingDealId]);

  const dealCountsByClient = useMemo(() => {
    const map = new Map<string, { count: number; amount: number }>();

    for (const deal of deals) {
      const current = map.get(deal.clientId) ?? { count: 0, amount: 0 };
      current.count += 1;
      current.amount += deal.amount;
      map.set(deal.clientId, current);
    }

    return map;
  }, [deals]);

  const totals = useMemo(() => {
    const pipelineDeals = deals.filter((deal) => deal.status === "NEW" || deal.status === "IN_PROGRESS");
    const wonDeals = deals.filter((deal) => deal.status === "WON");

    return {
      totalClients: clientsResponse?.meta.total ?? 0,
      totalDeals: deals.length,
      pipelineValue: pipelineDeals.reduce((sum, deal) => sum + deal.amount, 0),
      wonRevenue: wonDeals.reduce((sum, deal) => sum + deal.amount, 0),
      activeDeals: pipelineDeals.length
    };
  }, [clientsResponse?.meta.total, deals]);

  const visibleDeals = useMemo(() => {
    return deals.filter((deal) => {
      const statusMatches = statusFilter === "ALL" || deal.status === statusFilter;
      const clientMatches = clientFilter === "ALL" || deal.clientId === clientFilter;
      return statusMatches && clientMatches;
    });
  }, [clientFilter, deals, statusFilter]);

  const selectedClient = useMemo(
    () => clientOptions.find((client) => client.id === dealForm.clientId) ?? null,
    [clientOptions, dealForm.clientId]
  );

  const clientSummary = useMemo(() => {
    return clientsResponse?.data.map((client) => {
      const stats = dealCountsByClient.get(client.id) ?? { count: 0, amount: 0 };

      return {
        ...client,
        dealCount: stats.count,
        dealAmount: stats.amount
      };
    });
  }, [clientsResponse?.data, dealCountsByClient]);

  const resetClientForm = () => {
    setEditingClientId(null);
    setClientForm(emptyClientForm);
  };

  const resetDealForm = () => {
    setEditingDealId(null);
    setDealForm({
      title: "",
      amount: "",
      status: "NEW",
      clientId: clientOptions[0]?.id ?? ""
    });
  };

  const focusSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  const handleEditClient = (client: ClientSummary) => {
    setEditingClientId(client.id);
    setClientForm({
      name: client.name,
      email: client.email,
      phone: client.phone ?? ""
    });
    focusSection("client-form");
  };

  const handleEditDeal = (deal: DealWithClient) => {
    setEditingDealId(deal.id);
    setDealForm({
      title: deal.title,
      amount: String(deal.amount),
      status: deal.status,
      clientId: deal.clientId
    });
    focusSection("deal-form");
  };

  const handleClientSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingClient(true);
    setError(null);

    const payload = {
      name: clientForm.name.trim(),
      email: clientForm.email.trim(),
      ...(clientForm.phone.trim() ? { phone: clientForm.phone.trim() } : {})
    };

    try {
      if (editingClientId) {
        await updateClient(editingClientId, {
          name: payload.name,
          email: payload.email,
          phone: clientForm.phone.trim() ? clientForm.phone.trim() : null
        });
        resetClientForm();
        await refreshData(clientPage);
      } else {
        await createClient(payload);
        resetClientForm();

        if (clientPage === 1) {
          await refreshData(1);
        } else {
          setClientPage(1);
        }
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to save client");
    } finally {
      setSavingClient(false);
    }
  };

  const handleDealSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingDeal(true);
    setError(null);

    const amount = Number(dealForm.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Deal amount must be greater than 0");
      setSavingDeal(false);
      return;
    }

    if (!dealForm.clientId) {
      setError("Please choose a client for the deal");
      setSavingDeal(false);
      return;
    }

    try {
      if (editingDealId) {
        await updateDeal(editingDealId, {
          title: dealForm.title.trim(),
          amount,
          status: dealForm.status,
          clientId: dealForm.clientId
        });
      } else {
        await createDeal({
          title: dealForm.title.trim(),
          amount,
          status: dealForm.status,
          clientId: dealForm.clientId
        });
      }

      resetDealForm();
      await refreshData(clientPage);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to save deal");
    } finally {
      setSavingDeal(false);
    }
  };

  const handleClientDelete = async (client: ClientSummary) => {
    const confirmed = window.confirm(`Delete ${client.name}? This will remove all related deals.`);
    if (!confirmed) {
      return;
    }

    setDeletingClientId(client.id);
    setError(null);

    try {
      await deleteClient(client.id);

      if (editingClientId === client.id) {
        resetClientForm();
      }

      if (dealForm.clientId === client.id) {
        resetDealForm();
      }

      await refreshData(clientPage);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete client");
    } finally {
      setDeletingClientId(null);
    }
  };

  const handleDealDelete = async (deal: DealWithClient) => {
    const confirmed = window.confirm(`Delete deal "${deal.title}"?`);
    if (!confirmed) {
      return;
    }

    setDeletingDealId(deal.id);
    setError(null);

    try {
      await deleteDeal(deal.id);

      if (editingDealId === deal.id) {
        resetDealForm();
      }

      await refreshData(clientPage);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete deal");
    } finally {
      setDeletingDealId(null);
    }
  };

  const clientItems = clientSummary ?? [];

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#f8fafc_35%,#fffaf3_100%)] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/85 p-7 shadow-[0_22px_70px_rgba(15,23,42,0.10)] backdrop-blur">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.14),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.12),transparent_28%)]" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                <span className="h-2 w-2 rounded-full bg-sky-500" />
                CRM MVP control center
              </div>

              <div className="mt-6 flex flex-col gap-5">
                <div className="max-w-3xl">
                  <h1 className="text-4xl font-semibold tracking-tight text-balance text-slate-950 sm:text-5xl lg:text-6xl">
                    Керуємо клієнтами й угодами в одному чистому робочому просторі
                  </h1>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                    Без стартового шуму, без демо-скелетона. Тут уже є CRUD для клієнтів та угод,
                    фільтри, пагінація й стани для нашого MVP.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button type="button" size="lg" className="px-5" onClick={() => focusSection("client-form")}>
                    Новий клієнт
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    className="border-slate-200 bg-white/90 px-5"
                    onClick={() => focusSection("deal-form")}
                  >
                    Нова угода
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    variant="ghost"
                    className="px-5 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    onClick={() => void refreshData(clientPage)}
                  >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                    Оновити
                  </Button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard
                    icon={Users}
                    title="Клієнти"
                    value={String(totals.totalClients)}
                    hint={`Показуємо сторінку ${clientPage} з ${
                      clientsResponse?.meta.totalPages ?? 1
                    }. Оновлюється через backend pagination.`}
                  />
                  <StatCard
                    icon={BriefcaseBusiness}
                    title="Угоди"
                    value={String(totals.totalDeals)}
                    hint={`${statusCountLabel(totals.activeDeals)} зараз у роботі`}
                  />
                  <StatCard
                    icon={CircleDollarSign}
                    title="Pipeline value"
                    value={formatCurrency(totals.pipelineValue)}
                    hint="Сума NEW + IN_PROGRESS угод"
                  />
                  <StatCard
                    icon={CheckCircle2}
                    title="Won revenue"
                    value={formatCurrency(totals.wonRevenue)}
                    hint="Виграні угоди в цьому seed-даному наборі"
                  />
                </div>
              </div>
            </div>
          </section>

          <aside className="rounded-[2rem] border border-slate-200/80 bg-white/85 p-7 shadow-[0_22px_70px_rgba(15,23,42,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">Workflow</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Що вміє MVP</h2>
            <div className="mt-5 space-y-4">
              {[
                {
                  icon: Users,
                  title: "Clients CRUD",
                  text: "Створення, редагування, видалення й пагінація клієнтів."
                },
                {
                  icon: BriefcaseBusiness,
                  title: "Deals pipeline",
                  text: "Угоди зі статусами, фільтрами та прив’язкою до клієнта."
                },
                {
                  icon: Filter,
                  title: "Fast filters",
                  text: "Моментальний фільтр угод за статусом і клієнтом без перезавантаження."
                },
                {
                  icon: Target,
                  title: "Operational focus",
                  text: "Показуємо тільки те, що треба для першої робочої версії продукту."
                }
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <div className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-950">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Clock3 className="h-4 w-4" />
                Last sync
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {lastSyncedAt ? formatDate(lastSyncedAt) : "Waiting for the first sync"}
              </p>
            </div>
          </aside>
        </header>

        {error ? (
          <div className="mt-6 rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_16px_50px_rgba(15,23,42,0.07)]">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <SectionTitle
                  kicker="Clients"
                  title="База клієнтів"
                  description="Пагінація вже працює на backend, а тут ми маємо простий контроль над записами й швидкий доступ до редагування."
                />

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-slate-200 bg-white"
                    onClick={() => setClientPage((current) => Math.max(1, current - 1))}
                    disabled={clientPage <= 1 || isInitialLoading}
                  >
                    Previous
                  </Button>
                  <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                    Page {clientPage} / {clientsResponse?.meta.totalPages ?? 1}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-slate-200 bg-white"
                    onClick={() =>
                      setClientPage((current) =>
                        Math.min(clientsResponse?.meta.totalPages ?? 1, current + 1)
                      )
                    }
                    disabled={clientPage >= (clientsResponse?.meta.totalPages ?? 1) || isInitialLoading}
                  >
                    Next
                  </Button>
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                {isInitialLoading ? (
                  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-8 text-sm text-slate-500">
                    Loading clients and deals...
                  </div>
                ) : clientItems.length > 0 ? (
                  clientItems.map((client) => {
                    const stats = dealCountsByClient.get(client.id) ?? { count: 0, amount: 0 };

                    return (
                      <article
                        key={client.id}
                        className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.05)]"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-lg font-semibold text-slate-950">{client.name}</h3>
                              <span className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">
                                {statusCountLabel(stats.count)}
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-slate-600">{client.email}</p>
                            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                              <span className="rounded-full bg-slate-100 px-2.5 py-1">
                                Created {formatDate(client.createdAt)}
                              </span>
                              <span className="rounded-full bg-slate-100 px-2.5 py-1">
                                {client.phone ?? "No phone"}
                              </span>
                              <span className="rounded-full bg-slate-100 px-2.5 py-1">
                                Pipeline {formatCurrency(stats.amount)}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="border-slate-200 bg-white"
                              onClick={() => handleEditClient(client)}
                            >
                              <PencilLine className="h-4 w-4" />
                              Edit
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="border-rose-200 bg-white text-rose-700 hover:bg-rose-50"
                              onClick={() => void handleClientDelete(client)}
                              disabled={deletingClientId === client.id}
                            >
                              <Trash2 className="h-4 w-4" />
                              {deletingClientId === client.id ? "Deleting..." : "Delete"}
                            </Button>
                          </div>
                        </div>
                      </article>
                    );
                  })
                ) : (
                  <EmptyState
                    icon={Users}
                    title="No clients yet"
                    text="Створи першого клієнта у формі справа, і він одразу з’явиться в цій таблиці."
                  />
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_16px_50px_rgba(15,23,42,0.07)]">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <SectionTitle
                  kicker="Deals"
                  title="Пайплайн угод"
                  description="Фільтри працюють моментально на фронтенді, а всі угоди мають прив’язку до клієнтів."
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Status">
                    <FieldSelect
                      value={statusFilter}
                      onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                    >
                      <option value="ALL">All statuses</option>
                      {DEAL_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {statusMeta(status).label}
                        </option>
                      ))}
                    </FieldSelect>
                  </Field>

                  <Field label="Client">
                    <FieldSelect
                      value={clientFilter}
                      onChange={(event) => setClientFilter(event.target.value)}
                    >
                      <option value="ALL">All clients</option>
                      {clientOptions.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </FieldSelect>
                  </Field>
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                {visibleDeals.length > 0 ? (
                  visibleDeals.map((deal) => {
                    const meta = statusMeta(deal.status);

                    return (
                      <article
                        key={deal.id}
                        className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.05)]"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-lg font-semibold text-slate-950">{deal.title}</h3>
                              <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${meta.badge}`}>
                                {meta.label}
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-slate-600">{deal.client.name}</p>
                            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                              <span className="rounded-full bg-slate-100 px-2.5 py-1">
                                {formatCurrency(deal.amount)}
                              </span>
                              <span className="rounded-full bg-slate-100 px-2.5 py-1">
                                {deal.client.email}
                              </span>
                              <span className="rounded-full bg-slate-100 px-2.5 py-1">
                                Created {formatDate(deal.createdAt)}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="border-slate-200 bg-white"
                              onClick={() => handleEditDeal(deal)}
                            >
                              <PencilLine className="h-4 w-4" />
                              Edit
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="border-rose-200 bg-white text-rose-700 hover:bg-rose-50"
                              onClick={() => void handleDealDelete(deal)}
                              disabled={deletingDealId === deal.id}
                            >
                              <Trash2 className="h-4 w-4" />
                              {deletingDealId === deal.id ? "Deleting..." : "Delete"}
                            </Button>
                          </div>
                        </div>
                      </article>
                    );
                  })
                ) : (
                  <EmptyState
                    icon={BriefcaseBusiness}
                    title="No deals match the current filters"
                    text="Скинь фільтри або додай нову угоду справа, щоб знову побачити pipeline."
                  />
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div
              id="client-form"
              className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_16px_50px_rgba(15,23,42,0.07)]"
            >
              <SectionTitle
                kicker="Client form"
                title={editingClientId ? "Редагування клієнта" : "Новий клієнт"}
                description="Додавай клієнта або оновлюй його контактні дані прямо з цього блоку."
              />

              <form className="mt-6 space-y-4" onSubmit={handleClientSubmit}>
                <Field label="Name">
                  <FieldInput
                    value={clientForm.name}
                    onChange={(event) =>
                      setClientForm((current) => ({ ...current, name: event.target.value }))
                    }
                    placeholder="Acme Inc"
                    required
                  />
                </Field>

                <Field label="Email">
                  <FieldInput
                    type="email"
                    value={clientForm.email}
                    onChange={(event) =>
                      setClientForm((current) => ({ ...current, email: event.target.value }))
                    }
                    placeholder="hello@acme.com"
                    required
                  />
                </Field>

                <Field label="Phone" hint="Optional">
                  <FieldInput
                    value={clientForm.phone}
                    onChange={(event) =>
                      setClientForm((current) => ({ ...current, phone: event.target.value }))
                    }
                    placeholder="+380501112233"
                  />
                </Field>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button type="submit" className="flex-1" disabled={savingClient}>
                    {savingClient ? "Saving..." : editingClientId ? "Update client" : "Create client"}
                  </Button>
                  {editingClientId ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="border-slate-200 bg-white"
                      onClick={resetClientForm}
                    >
                      Cancel
                    </Button>
                  ) : null}
                </div>
              </form>
            </div>

            <div
              id="deal-form"
              className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_16px_50px_rgba(15,23,42,0.07)]"
            >
              <SectionTitle
                kicker="Deal form"
                title={editingDealId ? "Редагування угоди" : "Нова угода"}
                description="Після створення угода одразу потрапляє в пайплайн і починає впливати на метрики."
              />

              <form className="mt-6 space-y-4" onSubmit={handleDealSubmit}>
                <Field label="Title">
                  <FieldInput
                    value={dealForm.title}
                    onChange={(event) =>
                      setDealForm((current) => ({ ...current, title: event.target.value }))
                    }
                    placeholder="Website redesign"
                    required
                  />
                </Field>

                <Field label="Amount" hint="USD">
                  <FieldInput
                    type="number"
                    min="0"
                    step="1"
                    value={dealForm.amount}
                    onChange={(event) =>
                      setDealForm((current) => ({ ...current, amount: event.target.value }))
                    }
                    placeholder="2500"
                    required
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Status">
                    <FieldSelect
                      value={dealForm.status}
                      onChange={(event) =>
                        setDealForm((current) => ({
                          ...current,
                          status: event.target.value as DealStatus
                        }))
                      }
                    >
                      {DEAL_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {statusMeta(status).label}
                        </option>
                      ))}
                    </FieldSelect>
                  </Field>

                  <Field label="Client">
                    <FieldSelect
                      value={dealForm.clientId}
                      onChange={(event) =>
                        setDealForm((current) => ({ ...current, clientId: event.target.value }))
                      }
                      disabled={clientOptions.length === 0}
                    >
                      <option value="">{clientOptions.length ? "Select client" : "No clients available"}</option>
                      {clientOptions.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </FieldSelect>
                  </Field>
                </div>

                {selectedClient ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    Current client: <span className="font-medium text-slate-950">{selectedClient.name}</span>
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button type="submit" className="flex-1" disabled={savingDeal}>
                    {savingDeal ? "Saving..." : editingDealId ? "Update deal" : "Create deal"}
                  </Button>
                  {editingDealId ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="border-slate-200 bg-white"
                      onClick={resetDealForm}
                    >
                      Cancel
                    </Button>
                  ) : null}
                </div>
              </form>
            </div>

            <div className="rounded-[2rem] border border-slate-200/80 bg-slate-950 p-6 text-slate-50 shadow-[0_16px_50px_rgba(15,23,42,0.16)]">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">Insight</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">MVP focus</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Цей екран уже покриває основний цикл: створюємо клієнта, відкриваємо угоду,
                змінюємо статус, редагуємо й видаляємо записи без переходів між сторінками.
              </p>
              <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-3 text-slate-50">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Ready for product iteration</p>
                  <p className="text-sm text-slate-400">Наступний крок - деталізація UX для реальних сценаріїв.</p>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

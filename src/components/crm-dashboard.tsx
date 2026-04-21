"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";

import {
  CrmDashboardView,
  type ClientCardItem,
  type ClientFormState,
  type DealFormState,
  type StatusFilter
} from "@/components/crm-dashboard-view";
import {
  createClient,
  createDeal,
  deleteClient,
  deleteDeal,
  listClients,
  listDeals,
  type ClientListResponse,
  type ClientSummary,
  type DealWithClient,
  updateClient,
  updateDeal
} from "@/lib/crm-api";

const CLIENT_PAGE_SIZE = 6;
const SELECT_PAGE_SIZE = 100;

const emptyClientForm: ClientFormState = {
  name: "",
  email: "",
  phone: ""
};

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

  const clientItems: ClientCardItem[] = useMemo(() => {
    return (clientsResponse?.data ?? []).map((client) => {
      const stats = dealCountsByClient.get(client.id) ?? { count: 0, amount: 0 };

      return {
        ...client,
        dealCount: stats.count,
        dealAmount: stats.amount
      };
    });
  }, [clientsResponse?.data, dealCountsByClient]);

  const resetClientForm = useCallback(() => {
    setEditingClientId(null);
    setClientForm(emptyClientForm);
  }, []);

  const resetDealForm = useCallback(() => {
    setEditingDealId(null);
    setDealForm({
      title: "",
      amount: "",
      status: "NEW",
      clientId: clientOptions[0]?.id ?? ""
    });
  }, [clientOptions]);

  const focusSection = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, []);

  const handleEditClient = useCallback(
    (client: ClientCardItem) => {
      setEditingClientId(client.id);
      setClientForm({
        name: client.name,
        email: client.email,
        phone: client.phone ?? ""
      });
      focusSection("client-form");
    },
    [focusSection]
  );

  const handleEditDeal = useCallback(
    (deal: DealWithClient) => {
      setEditingDealId(deal.id);
      setDealForm({
        title: deal.title,
        amount: String(deal.amount),
        status: deal.status,
        clientId: deal.clientId
      });
      focusSection("deal-form");
    },
    [focusSection]
  );

  const handleClientSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
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
    },
    [clientForm, clientPage, editingClientId, refreshData, resetClientForm]
  );

  const handleDealSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
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
    },
    [clientPage, dealForm, editingDealId, refreshData, resetDealForm]
  );

  const handleClientDelete = useCallback(
    async (client: ClientCardItem) => {
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
    },
    [clientPage, dealForm.clientId, editingClientId, refreshData, resetClientForm, resetDealForm]
  );

  const handleDealDelete = useCallback(
    async (deal: DealWithClient) => {
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
    },
    [clientPage, editingDealId, refreshData, resetDealForm]
  );

  return (
    <CrmDashboardView
      error={error}
      hero={{
        clientPage,
        totalPages: clientsResponse?.meta.totalPages ?? 1,
        totalClients: totals.totalClients,
        totalDeals: totals.totalDeals,
        pipelineValue: totals.pipelineValue,
        wonRevenue: totals.wonRevenue,
        activeDeals: totals.activeDeals,
        isRefreshing,
        lastSyncedAt,
        onRefresh: () => void refreshData(clientPage),
        onFocusClientForm: () => focusSection("client-form"),
        onFocusDealForm: () => focusSection("deal-form")
      }}
      clients={{
        clientItems,
        clientPage,
        totalPages: clientsResponse?.meta.totalPages ?? 1,
        isInitialLoading,
        deletingClientId,
        onPrevPage: () => setClientPage((current) => Math.max(1, current - 1)),
        onNextPage: () =>
          setClientPage((current) => Math.min(clientsResponse?.meta.totalPages ?? 1, current + 1)),
        onEditClient: handleEditClient,
        onDeleteClient: handleClientDelete
      }}
      deals={{
        visibleDeals,
        statusFilter,
        setStatusFilter,
        clientFilter,
        setClientFilter,
        clientOptions,
        selectedClient,
        deletingDealId,
        onEditDeal: handleEditDeal,
        onDeleteDeal: handleDealDelete
      }}
      forms={{
        clientForm,
        setClientForm,
        dealForm,
        setDealForm,
        editingClientId,
        editingDealId,
        savingClient,
        savingDeal,
        onSubmitClient: handleClientSubmit,
        onSubmitDeal: handleDealSubmit,
        onCancelClient: resetClientForm,
        onCancelDeal: resetDealForm
      }}
    />
  );
}

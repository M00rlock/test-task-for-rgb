import type { Dispatch, FormEvent, SetStateAction } from "react";

import type { ClientSummary, DealStatus, DealWithClient } from "@/lib/crm-api";

export type StatusFilter = DealStatus | "ALL";

export type ClientCardItem = ClientSummary & {
  dealCount: number;
  dealAmount: number;
};

export type ClientFormState = {
  name: string;
  email: string;
  phone: string;
};

export type DealFormState = {
  title: string;
  amount: string;
  status: DealStatus;
  clientId: string;
};

export type CrmDashboardViewProps = {
  error: string | null;
  hero: {
    clientPage: number;
    totalPages: number;
    totalClients: number;
    totalDeals: number;
    pipelineValue: number;
    wonRevenue: number;
    activeDeals: number;
    isRefreshing: boolean;
    lastSyncedAt: string | null;
    onRefresh: () => void;
    onFocusClientForm: () => void;
    onFocusDealForm: () => void;
  };
  clients: {
    clientItems: ClientCardItem[];
    clientPage: number;
    totalPages: number;
    isInitialLoading: boolean;
    deletingClientId: string | null;
    onPrevPage: () => void;
    onNextPage: () => void;
    onEditClient: (client: ClientCardItem) => void;
    onDeleteClient: (client: ClientCardItem) => void;
  };
  deals: {
    visibleDeals: DealWithClient[];
    statusFilter: StatusFilter;
    setStatusFilter: Dispatch<SetStateAction<StatusFilter>>;
    clientFilter: string;
    setClientFilter: Dispatch<SetStateAction<string>>;
    clientOptions: ClientSummary[];
    selectedClient: ClientSummary | null;
    deletingDealId: string | null;
    onEditDeal: (deal: DealWithClient) => void;
    onDeleteDeal: (deal: DealWithClient) => void;
  };
  forms: {
    clientForm: ClientFormState;
    setClientForm: Dispatch<SetStateAction<ClientFormState>>;
    dealForm: DealFormState;
    setDealForm: Dispatch<SetStateAction<DealFormState>>;
    editingClientId: string | null;
    editingDealId: string | null;
    savingClient: boolean;
    savingDeal: boolean;
    onSubmitClient: (event: FormEvent<HTMLFormElement>) => void;
    onSubmitDeal: (event: FormEvent<HTMLFormElement>) => void;
    onCancelClient: () => void;
    onCancelDeal: () => void;
  };
};

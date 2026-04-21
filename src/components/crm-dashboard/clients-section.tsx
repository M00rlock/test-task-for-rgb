import { Users } from "lucide-react";

import { RecordActions } from "@/components/crm-actions";
import { Button } from "@/components/ui/button";

import type { CrmDashboardViewProps } from "./types";
import { EmptyState, SectionTitle, formatCurrency, formatDate, statusCountLabel } from "./shared";

type ClientsSectionProps = CrmDashboardViewProps["clients"];

export function ClientsSection({
  clientItems,
  clientPage,
  totalPages,
  isInitialLoading,
  deletingClientId,
  onPrevPage,
  onNextPage,
  onEditClient,
  onDeleteClient
}: ClientsSectionProps) {
  return (
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
            onClick={onPrevPage}
            disabled={clientPage <= 1 || isInitialLoading}
          >
            Previous
          </Button>
          <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            Page {clientPage} / {totalPages}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-slate-200 bg-white"
            onClick={onNextPage}
            disabled={clientPage >= totalPages || isInitialLoading}
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
          clientItems.map((client) => (
            <article
              key={client.id}
              className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.05)]"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-slate-950">{client.name}</h3>
                    <span className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">
                      {statusCountLabel(client.dealCount)}
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
                      Pipeline {formatCurrency(client.dealAmount)}
                    </span>
                  </div>
                </div>

                <RecordActions
                  onEdit={() => onEditClient(client)}
                  onDelete={() => onDeleteClient(client)}
                  isDeleting={deletingClientId === client.id}
                />
              </div>
            </article>
          ))
        ) : (
          <EmptyState
            icon={Users}
            title="No clients yet"
            text="Створи першого клієнта у формі справа, і він одразу з’явиться в цій таблиці."
          />
        )}
      </div>
    </div>
  );
}

import type { Dispatch, SetStateAction } from "react";
import { BriefcaseBusiness } from "lucide-react";

import { RecordActions } from "@/components/crm-actions";

import { EmptyState, Field, FieldSelect, SectionTitle, formatCurrency, formatDate, statusMeta } from "./shared";
import { DEAL_STATUSES, type ClientSummary, type DealWithClient } from "@/lib/crm-api";
import type { CrmDashboardViewProps, StatusFilter } from "./types";

type DealsSectionProps = CrmDashboardViewProps["deals"];

export function DealsSection({
  visibleDeals,
  statusFilter,
  setStatusFilter,
  clientFilter,
  setClientFilter,
  clientOptions,
  deletingDealId,
  onEditDeal,
  onDeleteDeal
}: DealsSectionProps) {
  return (
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
            <FieldSelect value={clientFilter} onChange={(event) => setClientFilter(event.target.value)}>
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
                      <span className="rounded-full bg-slate-100 px-2.5 py-1">{deal.client.email}</span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1">
                        Created {formatDate(deal.createdAt)}
                      </span>
                    </div>
                  </div>

                  <RecordActions
                    onEdit={() => onEditDeal(deal)}
                    onDelete={() => onDeleteDeal(deal)}
                    isDeleting={deletingDealId === deal.id}
                  />
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
  );
}

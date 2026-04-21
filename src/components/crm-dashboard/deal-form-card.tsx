import type { Dispatch, FormEvent, SetStateAction } from "react";

import { FormActions } from "@/components/crm-actions";
import { DEAL_STATUSES, type ClientSummary, type DealStatus } from "@/lib/crm-api";

import { Field, FieldInput, FieldSelect, SectionTitle, statusMeta } from "./shared";
import type { DealFormState } from "./types";

export function DealFormCard({
  editingDealId,
  dealForm,
  setDealForm,
  savingDeal,
  clientOptions,
  selectedClient,
  onSubmit,
  onCancel
}: {
  editingDealId: string | null;
  dealForm: DealFormState;
  setDealForm: Dispatch<SetStateAction<DealFormState>>;
  savingDeal: boolean;
  clientOptions: ClientSummary[];
  selectedClient: ClientSummary | null;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}) {
  return (
    <div
      id="deal-form"
      className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_16px_50px_rgba(15,23,42,0.07)]"
    >
      <SectionTitle
        kicker="Deal form"
        title={editingDealId ? "Редагування угоди" : "Нова угода"}
        description="Після створення угода одразу потрапляє в пайплайн і починає впливати на метрики."
      />

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <Field label="Title">
          <FieldInput
            value={dealForm.title}
            onChange={(event) => setDealForm((current) => ({ ...current, title: event.target.value }))}
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
            onChange={(event) => setDealForm((current) => ({ ...current, amount: event.target.value }))}
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
              onChange={(event) => setDealForm((current) => ({ ...current, clientId: event.target.value }))}
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

        <FormActions
          submitLabel={editingDealId ? "Update deal" : "Create deal"}
          isSubmitting={savingDeal}
          onCancel={editingDealId ? onCancel : undefined}
        />
      </form>
    </div>
  );
}

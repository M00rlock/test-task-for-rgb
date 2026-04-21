import type { Dispatch, FormEvent, SetStateAction } from "react";

import { FormActions } from "@/components/crm-actions";

import { Field, FieldInput, SectionTitle } from "./shared";
import type { ClientFormState } from "./types";

export function ClientFormCard({
  editingClientId,
  clientForm,
  setClientForm,
  savingClient,
  onSubmit,
  onCancel
}: {
  editingClientId: string | null;
  clientForm: ClientFormState;
  setClientForm: Dispatch<SetStateAction<ClientFormState>>;
  savingClient: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}) {
  return (
    <div
      id="client-form"
      className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_16px_50px_rgba(15,23,42,0.07)]"
    >
      <SectionTitle
        kicker="Client form"
        title={editingClientId ? "Редагування клієнта" : "Новий клієнт"}
        description="Додавай клієнта або оновлюй його контактні дані прямо з цього блоку."
      />

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <Field label="Name">
          <FieldInput
            value={clientForm.name}
            onChange={(event) => setClientForm((current) => ({ ...current, name: event.target.value }))}
            placeholder="Acme Inc"
            required
          />
        </Field>

        <Field label="Email">
          <FieldInput
            type="email"
            value={clientForm.email}
            onChange={(event) => setClientForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="hello@acme.com"
            required
          />
        </Field>

        <Field label="Phone" hint="Optional">
          <FieldInput
            value={clientForm.phone}
            onChange={(event) => setClientForm((current) => ({ ...current, phone: event.target.value }))}
            placeholder="+380501112233"
          />
        </Field>

        <FormActions
          submitLabel={editingClientId ? "Update client" : "Create client"}
          isSubmitting={savingClient}
          onCancel={editingClientId ? onCancel : undefined}
        />
      </form>
    </div>
  );
}

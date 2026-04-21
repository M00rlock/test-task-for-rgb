import type { CrmDashboardViewProps } from "./crm-dashboard/types";
import { ClientsSection } from "./crm-dashboard/clients-section";
import { DealFormCard } from "./crm-dashboard/deal-form-card";
import { DealsSection } from "./crm-dashboard/deals-section";
import { DashboardHero } from "./crm-dashboard/hero-section";
import { ClientFormCard } from "./crm-dashboard/client-form-card";
import { WorkflowCard } from "./crm-dashboard/workflow-card";

export type { CrmDashboardViewProps } from "./crm-dashboard/types";

export function CrmDashboardView({ error, hero, clients, deals, forms }: CrmDashboardViewProps) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#f8fafc_35%,#fffaf3_100%)] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <DashboardHero {...hero} />
          <WorkflowCard lastSyncedAt={hero.lastSyncedAt} />
        </header>

        {error ? (
          <div className="mt-6 rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
          <div className="space-y-6">
            <ClientsSection {...clients} />
            <DealsSection {...deals} />
          </div>

          <aside className="space-y-6">
            <ClientFormCard
              editingClientId={forms.editingClientId}
              clientForm={forms.clientForm}
              setClientForm={forms.setClientForm}
              savingClient={forms.savingClient}
              onSubmit={forms.onSubmitClient}
              onCancel={forms.onCancelClient}
            />
            <DealFormCard
              editingDealId={forms.editingDealId}
              dealForm={forms.dealForm}
              setDealForm={forms.setDealForm}
              savingDeal={forms.savingDeal}
              clientOptions={deals.clientOptions}
              selectedClient={deals.selectedClient}
              onSubmit={forms.onSubmitDeal}
              onCancel={forms.onCancelDeal}
            />
          </aside>
        </section>
      </div>
    </main>
  );
}

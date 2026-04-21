import { BriefcaseBusiness, Clock3, Filter, Target, Users } from "lucide-react";

import { formatDate } from "./shared";

export function WorkflowCard({ lastSyncedAt }: { lastSyncedAt: string | null }) {
  return (
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
  );
}

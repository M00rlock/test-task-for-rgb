import { ArrowRight, BriefcaseBusiness, CheckCircle2, CircleDollarSign, Plus, RefreshCw, Users } from "lucide-react";

import { Button } from "@/components/ui/button";

import { formatCurrency, StatCard } from "./shared";

export function DashboardHero({
  clientPage,
  totalPages,
  totalClients,
  totalDeals,
  pipelineValue,
  wonRevenue,
  activeDeals,
  isRefreshing,
  onRefresh,
  onFocusClientForm,
  onFocusDealForm
}: {
  clientPage: number;
  totalPages: number;
  totalClients: number;
  totalDeals: number;
  pipelineValue: number;
  wonRevenue: number;
  activeDeals: number;
  isRefreshing: boolean;
  onRefresh: () => void;
  onFocusClientForm: () => void;
  onFocusDealForm: () => void;
}) {
  return (
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
            <Button type="button" size="lg" className="px-5" onClick={onFocusClientForm}>
              Новий клієнт
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              className="border-slate-200 bg-white/90 px-5"
              onClick={onFocusDealForm}
            >
              Нова угода
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="lg"
              variant="ghost"
              className="px-5 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              onClick={onRefresh}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Оновити
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={Users}
              title="Клієнти"
              value={String(totalClients)}
              hint={`Показуємо сторінку ${clientPage} з ${totalPages}. Оновлюється через backend pagination.`}
            />
            <StatCard
              icon={BriefcaseBusiness}
              title="Угоди"
              value={String(totalDeals)}
              hint={`${activeDeals} deals зараз у роботі`}
            />
            <StatCard
              icon={CircleDollarSign}
              title="Pipeline value"
              value={formatCurrency(pipelineValue)}
              hint="Сума NEW + IN_PROGRESS угод"
            />
            <StatCard
              icon={CheckCircle2}
              title="Won revenue"
              value={formatCurrency(wonRevenue)}
              hint="Виграні угоди в цьому seed-даному наборі"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

import { CheckCircle2 } from "lucide-react";

export function InsightCard() {
  return (
    <div className="rounded-[2rem] border border-slate-200/80 bg-slate-950 p-6 text-slate-50 shadow-[0_16px_50px_rgba(15,23,42,0.16)]">
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">Insight</p>
      <h3 className="mt-2 text-2xl font-semibold tracking-tight">MVP focus</h3>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        Цей екран уже покриває основний цикл: створюємо клієнта, відкриваємо угоду, змінюємо статус,
        редагуємо й видаляємо записи без переходів між сторінками.
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
  );
}

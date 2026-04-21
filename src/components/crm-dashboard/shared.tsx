import type { ComponentType, ReactNode, InputHTMLAttributes, SelectHTMLAttributes } from "react";

import type { DealStatus } from "@/lib/crm-api";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

export function statusMeta(status: DealStatus) {
  switch (status) {
    case "NEW":
      return {
        label: "New",
        badge: "border-amber-200 bg-amber-50 text-amber-700"
      };
    case "IN_PROGRESS":
      return {
        label: "In progress",
        badge: "border-sky-200 bg-sky-50 text-sky-700"
      };
    case "WON":
      return {
        label: "Won",
        badge: "border-emerald-200 bg-emerald-50 text-emerald-700"
      };
    case "LOST":
      return {
        label: "Lost",
        badge: "border-rose-200 bg-rose-50 text-rose-700"
      };
    default:
      throw new Error(`Unsupported status: ${status}`);
  }
}

export function statusCountLabel(count: number) {
  return `${count} deal${count === 1 ? "" : "s"}`;
}

export function SectionTitle({
  kicker,
  title,
  description
}: {
  kicker: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">{kicker}</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

export function Field({
  label,
  hint,
  children
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-800">{label}</span>
        {hint ? <span className="text-xs text-slate-400">{hint}</span> : null}
      </div>
      {children}
    </label>
  );
}

export function FieldInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 ${props.className ?? ""}`}
    />
  );
}

export function FieldSelect(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100 ${props.className ?? ""}`}
    />
  );
}

export function StatCard({
  icon: Icon,
  title,
  value,
  hint
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/85 p-5 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-700">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-500">{hint}</p>
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  text
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/60 p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}


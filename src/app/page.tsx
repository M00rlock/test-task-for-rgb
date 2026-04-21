import { ArrowRight, Boxes, Sparkles, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";

const highlights = [
  {
    icon: Sparkles,
    title: "Shadcn-ready foundation",
    description: "Reusable components with Tailwind tokens and a clean path for expansion."
  },
  {
    icon: Wand2,
    title: "TypeScript-first setup",
    description: "Strict typing and App Router structure from the very beginning."
  },
  {
    icon: Boxes,
    title: "Scalable structure",
    description: "Aliases, component layers, and config files prepared for product work."
  }
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 py-12 lg:px-10">
        <div className="grid w-full gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <section className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-8 shadow-soft backdrop-blur md:p-12">
            <div className="absolute inset-0 bg-hero-grid opacity-40" />
            <div className="relative max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-sm text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Frontend scaffold is ready
              </div>

              <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
                Next.js старт з акуратною базою для швидкого продуктового розвитку
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                Тут уже підготовлено TypeScript, Tailwind CSS та shadcn/ui-style компоненти, щоб ми
                могли одразу рухатися до реального інтерфейсу без зайвого базового налаштування.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button className="px-6" size="lg">
                  Почати роботу
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button className="px-6" size="lg" variant="outline">
                  Подивитися структуру
                </Button>
              </div>
            </div>
          </section>

          <aside className="grid gap-4">
            {highlights.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-primary p-3 text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-foreground">{title}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="rounded-2xl border border-dashed border-border bg-background/70 p-6">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Next steps
              </p>
              <p className="mt-3 text-sm leading-6 text-foreground">
                Далі можемо додати навігацію, базові сторінки, auth-заготовку або перший блок
                дизайну під продукт.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}


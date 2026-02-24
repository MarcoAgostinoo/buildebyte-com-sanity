import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <>
      {/* TOP BAR */}
      <div className="w-full bg-black text-zinc-400 text-xs border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 h-8 flex items-center justify-between">
          <span>
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span className="uppercase tracking-widest hidden md:block">
            Inteligência • Defesa • Tecnologia
          </span>
        </div>
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#0b0f14] border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4">

          {/* INPUT PARA TOGGLE */}
          <input type="checkbox" id="menu-toggle" className="peer hidden" />

          <nav className="flex items-center justify-between h-16">

            {/* LOGO */}
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                width={80}
                height={80}
                alt="Vetor Estratégico"
                priority
              />
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-bold text-white tracking-wide">
                  VETOR ESTRATÉGICO
                </span>
                <span className="text-xs text-zinc-400 tracking-widest uppercase">
                  Análise de Impacto Sistêmico
                </span>
              </div>
            </Link>

            {/* BOTÃO MOBILE */}
            <label
              htmlFor="menu-toggle"
              className="md:hidden text-white cursor-pointer text-2xl"
            >
              ☰
            </label>

            {/* MENU DESKTOP */}
            <div className="hidden md:flex items-center gap-10 text-base font-extrabold tracking-widest uppercase [font-family:var(--font-oswald)]">
              <NavItem href="/" label="INÍCIO" />
              <NavItem href="/destaques" label="DESTAQUES" />
              <NavItem href="/noticias" label="NOTÍCIAS" />
              <NavItem href="/tecnologia" label="TECNOLOGIA" />
              <NavItem href="/videos" label="VÍDEOS" />
              <NavItem href="/contato" label="CONTATO" />
            </div>
          </nav>

          {/* MENU MOBILE */}
          <div className="hidden peer-checked:block md:hidden pb-6 pt-4 border-t border-zinc-800">
            <div className="flex flex-col gap-6 text-base font-extrabold tracking-widest uppercase [font-family:var(--font-oswald)]">
              <NavItem href="/" label="INÍCIO" />
              <NavItem href="/destaques" label="DESTAQUES" />
              <NavItem href="/noticias" label="NOTÍCIAS" />
              <NavItem href="/tecnologia" label="TECNOLOGIA" />
              <NavItem href="/videos" label="VÍDEOS" />
              <NavItem href="/contato" label="CONTATO" />
            </div>
          </div>

        </div>
      </header>
    </>
  );
}

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="
        text-white
        relative
        transition-colors
        duration-200
        hover:text-blue-500
        after:content-['']
        after:absolute
        after:left-0
        after:-bottom-1
        after:w-0
        after:h-[4px]
        after:bg-red-600
        after:transition-all
        hover:after:w-full
      "
    >
      {label}
    </Link>
  );
}
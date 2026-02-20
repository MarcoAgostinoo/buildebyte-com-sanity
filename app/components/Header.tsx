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
          <span className="uppercase tracking-wider hidden md:block">
            Inteligência • Defesa • Tecnologia
          </span>
        </div>
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#0b0f14] border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center justify-between h-16">
            
            {/* LOGO */}
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                width={50}
                height={50}
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
            <input type="checkbox" id="menu-toggle" className="peer hidden" />

            <label
              htmlFor="menu-toggle"
              className="md:hidden text-white cursor-pointer"
            >
              ☰
            </label>

            {/* MENU */}
            <div className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide">
              <NavItem href="/" label="INÍCIO" />
              <NavItem href="/analises" label="ANÁLISES" />
              <NavItem href="/mundo" label="MUNDO" />
              <NavItem href="/tecnologia" label="TECNOLOGIA" />
              <NavItem href="/videos" label="VÍDEOS" />
              <NavItem href="/contato" label="CONTATO" />
            </div>
          </nav>

          {/* MENU MOBILE */}
          <div className="peer-checked:block hidden md:hidden pb-4">
            <div className="flex flex-col gap-4 text-sm font-semibold tracking-wide">
              <NavItem href="/" label="INÍCIO" />
              <NavItem href="/analises" label="ANÁLISES" />
              <NavItem href="/mundo" label="MUNDO" />
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
      className="text-zinc-300 hover:text-red-500 transition-colors duration-200"
    >
      {label}
    </Link>
  );
}
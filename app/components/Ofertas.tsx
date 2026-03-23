import { client } from "@/app/lib/sanity";
import dynamic from 'next/dynamic';
import styles from './MilitaryTheme.module.css';

// Carregamento dinâmico sem o falso problema de SSR
const OfertasCarousel = dynamic(
  () => import('./OfertasCarousel').then((mod) => mod.OfertasCarousel),
  { 
    loading: () => (
      <div className="h-80 flex flex-col items-center justify-center animate-pulse bg-mil-dark border border-mil-border">
        <div className="w-8 h-8 border-2 border-t-mil-gold border-r-mil-gold border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-[12px] font-black uppercase tracking-[0.2em] text-mil-gold/60">Sincronizando Dados Logísticos...</p>
      </div>
    )
  }
);

// A Query permanece a mesma, pois seu schema Sanity está correto
const QUERY = `*[_type == "oferta" && destaqueHome == true] | order(publishedAt desc) {
  _id, title, price, originalPrice, installments,
  storeName, affiliateLink, mainImage, description
}`;

export default async function Ofertas() {
  const ofertas = await client.fetch(QUERY, {}, { next: { revalidate: 3600 } });

  // Se não houver ofertas cadastradas, não exibe o bloco (evita espaços em branco)
  if (!ofertas || ofertas.length === 0) return null;

  return (
    <section className={`py-12 ${styles.mil_section} relative overflow-hidden`}>
      {/* A classe mil-section do seu globals.css já traz o fundo com ruído 
        e o mil-black padrão. Aqui reforçamos a imersão tática.
      */}
      
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* --- HEADER TÁTICO --- */}
        <div className={styles.mil_header}>
          <div className={styles.mil_title_wrap}>
            <div className={styles.mil_title_icon}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <h2 className={styles.mil_section_title}>
              Equipamento <span>Recomendado</span>
            </h2>
          </div>
          
          <div className="hidden md:flex flex-col items-end">
             <div className={styles.mil_classification}>
               Status: Operacional
             </div>
             <p className="text-[12px] uppercase tracking-wider text-mil-muted mt-1">
               Protocolo EDC
             </p>
          </div>
        </div>
        
        <div className={styles.mil_divider}></div>

        {/* --- CARROSSEL / PAINEL --- */}
        <div className={`relative bg-mil-panel border border-mil-border shadow-2xl p-1 overflow-hidden group`}>
          {/* Efeito Scanline do seu CSS global */}
          <div className={styles.mil_scan_line}></div>
          
          <div className="relative z-10 p-4 sm:p-6 bg-black/30">
             {/* Componente Cliente que renderiza os cards */}
            <OfertasCarousel ofertas={ofertas} />
          </div>
        </div>

        {/* --- FOOTER TÁTICO (Disclaimer) --- */}
        <div className={`${styles.mil_statusbar} justify-end mt-2`}>
           <div className={styles.mil_status_right}>
             <span>Inventário Logístico Sujeito à Demanda do Fornecedor</span>
             <div className={`${styles.mil_status_dot} hidden sm:block`}></div>
           </div>
        </div>

      </div>
    </section>
  );
}
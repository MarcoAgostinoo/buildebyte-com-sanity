export const EDITORIAL_LABELS: Record<string, string> = {
  analise: "Análise",
  relatorio: "Relatório",
  guia: "Guia",
  comparativo: "Comparativo",
  review: "Review",
  opiniao: "Opinião",
};

export const EDITORIAL_COLORS: Record<string, string> = {
  analise:    "bg-blue-600",
  relatorio:  "bg-slate-600",
  guia:       "bg-emerald-600",
  comparativo:"bg-violet-600",
  review:     "bg-amber-600",
  opiniao:    "bg-orange-600",
};

export const EIXO_DATA: Record<string, { title: string; value: string; description: string }> = {
  // NOVOS EIXOS (usados no PillarBadge)
  "geopolitica-defesa": {
    title: "Geopolítica & Defesa",
    value: "geopolitica_defesa",
    description: "Análises sobre o cenário geopolítico global e as estratégias de defesa das nações."
  },
  "arsenal-tecnologia": {
    title: "Arsenal & Tecnologia",
    value: "arsenal_tecnologia",
    description: "Acompanhamento das inovações em tecnologia militar e o arsenal das potências globais."
  },
  "teatro-operacoes": {
    title: "Teatro de Operações",
    value: "teatro_operacoes",
    description: "Cobertura e análise de zonas de conflito e operações militares ao redor do mundo."
  },

  // EIXOS ANTIGOS (para compatibilidade, mesmo que mapeiem para os mesmos valores)
  "defesa-tecnologia": {
    title: "Defesa & Tecnologia",
    value: "defesa_tecnologia",
    description: "Análises sobre sistemas de defesa, soberania militar e tecnologias de dissuasão."
  },
  "infraestrutura-digital": {
    title: "Infraestrutura Digital",
    value: "infraestrutura_digital",
    description: "Cabos submarinos, datacenters, 5G e a espinha dorsal da conectividade estratégica."
  },
  "ia-automacao": {
    title: "IA & Automação",
    value: "ia_automacao",
    description: "O impacto da inteligência artificial e automação na economia e no poder estatal."
  },
  "economia-poder": {
    title: "Economia de Poder",
    value: "economia_poder",
    description: "Sanções, guerras comerciais, commodities e a geoeconomia como arma."
  },
  "brasil": {
    title: "Brasil Estratégico",
    value: "brasil",
    description: "O papel do Brasil no tabuleiro global, base industrial e soberania nacional."
  },
  "global": {
    title: "Cenário Global",
    value: "global",
    description: "Movimentos geopolíticos, alianças e tensões entre grandes potências."
  },
};

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre | Build-e-Byte",
  description: "Saiba mais sobre a missão e o propósito do portal Build-e-Byte.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Sobre o Build-e-Byte</h1>
      <div className="prose prose-lg max-w-none">
        <p>
          O <strong>Build-e-Byte</strong> nasceu da necessidade de traduzir a complexidade do mundo tecnológico, financeiro e geopolítico através da lente técnica e analítica de um Analista de Sistemas. Nossa missão é ir além das notícias superficiais, mergulhando no "como" os sistemas funcionam, com um foco incisivo em segurança, eficiência, soberania e otimização.
        </p>
        <p>
          Não somos apenas mais um portal de tecnologia. Somos um guia estratégico para entender as engrenagens que movem o mundo digital. Nosso diferencial é a autoridade técnica: cada artigo, cada análise, é construída sobre uma base sólida de conhecimento em arquitetura de sistemas, engenharia de software e segurança da informação.
        </p>
        <h2 className="text-2xl font-bold mt-6 mb-4">Nossos Pilares</h2>
        <p>
          O conteúdo do Build-e-Byte é estruturado em 10 pilares fundamentais, que representam as áreas mais críticas e disruptivas da tecnologia e da sociedade contemporânea:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Biohacking e Quantified Self:</strong> Exploração de métricas de longevidade, nutrição de precisão e a intersecção entre biologia e tecnologia, sempre com um olhar crítico sobre a privacidade biométrica.</li>
          <li><strong>Engenharia do Dinheiro:</strong> Análise profunda da arquitetura de moedas digitais como o Drex, trading algorítmico, cibersegurança bancária e a geopolítica dos semicondutores.</li>
          <li><strong>Casa Inteligente (IoT):</strong> Foco em soluções locais e seguras como Home Assistant, discutindo protocolos, eficiência energética e a importância da segurança em dispositivos conectados.</li>
          <li><strong>Sobrevivencialismo Digital:</strong> Preparação para um futuro incerto com redes mesh, servidores de contingência e criptografia de guerrilha, garantindo a soberania de comunicação.</li>
          <li><strong>Geopolítica Tech:</strong> Investigação sobre ciberguerra, soberania de dados, tecnologias de defesa e a infraestrutura crítica que sustenta a internet global.</li>
          <li><strong>Desenvolvimento e No-Code:</strong> Um mergulho no universo fullstack com Next.js e Strapi, automação de workflows e o impacto da IA no desenvolvimento de software.</li>
          <li><strong>Games e Hardware Gamer:</strong> Análise técnica de arquitetura de GPUs, otimização de engines e a busca pela menor latência no universo dos games.</li>
          <li><strong>Produtividade (Hardware):</strong> Guia para montar workstations de alta performance, otimizar setups e explorar o máximo do hardware para desenvolvimento e produtividade.</li>
          <li><strong>Mobilidade e Dispositivos:</strong> Auditoria da arquitetura de sistemas operacionais móveis, com foco em privacidade, segurança e reparabilidade.</li>
          <li><strong>IA Generativa e Automação:</strong> Discussão sobre o futuro do trabalho, a ética dos algoritmos e o poder dos LLMs locais e agentes de IA autônomos.</li>
        </ul>
        <h2 className="text-2xl font-bold mt-6 mb-4">Visão do Analista</h2>
        <p>
          Em cada artigo, você encontrará o box "Visão do Analista", um espaço dedicado a conectar o tema abordado com conceitos fundamentais de engenharia de sistemas. É o nosso "pulo do gato", o detalhe que transforma uma notícia em conhecimento aplicável.
        </p>
        <p>
          Bem-vindo ao <strong>Build-e-Byte</strong>. Aqui, a tecnologia é desmistificada, analisada e compreendida em sua essência.
        </p>
      </div>
    </div>
  );
}
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade | Build-e-Byte",
  description: "Entenda como o Build-e-Byte coleta, usa e protege suas informações.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Política de Privacidade</h1>
      <div className="prose prose-lg max-w-none">
        <p>
          Sua privacidade é fundamental para o Build-e-Byte. Esta política de privacidade explica quais dados pessoais coletamos e como os utilizamos. Nosso compromisso é com a transparência e a proteção da sua soberania digital.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-4">1. Coleta de Dados</h2>
        <p>
          O Build-e-Byte adota uma abordagem minimalista na coleta de dados. Coletamos informações das seguintes formas:
        </p>
        <ul>
          <li>
            <strong>Informações que você nos fornece:</strong> Ao entrar em contato conosco através de formulários, coletamos as informações que você envia, como nome e endereço de e-mail, exclusivamente para respondermos à sua solicitação.
          </li>
          <li>
            <strong>Dados de Navegação (Analytics):</strong> Utilizamos um sistema de análise de tráfego para entender como nossos leitores interagem com o portal. Estes dados são agregados e anonimizados, e não identificam usuários individualmente. Priorizamos ferramentas de análise que respeitam a privacidade.
          </li>
          <li>
            <strong>Cookies:</strong> Usamos cookies estritamente necessários para o funcionamento do site, como controle de sessão. Não utilizamos cookies de rastreamento de terceiros para fins publicitários.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-6 mb-4">2. Uso de Dados</h2>
        <p>
          Os dados coletados são utilizados para:
        </p>
        <ul>
          <li>Operar e manter a segurança e a eficiência do nosso portal.</li>
          <li>Melhorar a qualidade do nosso conteúdo, entendendo quais tópicos são mais relevantes para nossa audiência.</li>
          <li>Responder a dúvidas, críticas ou sugestões enviadas por você.</li>
        </ul>
        <p>
          Jamais venderemos ou compartilharemos suas informações pessoais com terceiros para fins de marketing.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-4">3. Segurança e Soberania de Dados</h2>
        <p>
          Em linha com nossos pilares de "Sobrevivencialismo Digital" e "Geopolítica Tech", levamos a segurança dos seus dados a sério. Implementamos medidas técnicas e organizacionais para proteger as informações contra acesso, alteração, divulgação ou destruição não autorizada. Isso inclui o uso de criptografia e a busca por auto-hospedagem de serviços sempre que possível, para garantir a soberania sobre nossos dados e, por extensão, sobre a sua privacidade.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-4">4. Seus Direitos</h2>
        <p>
          Você tem o direito de solicitar acesso, correção ou exclusão de suas informações pessoais que possamos ter. Como nossa coleta é mínima, na maioria dos casos, não teremos dados que possam identificá-lo diretamente, a menos que você tenha nos contatado.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-4">5. Links para Terceiros</h2>
        <p>
          Nosso site pode conter links para outros sites. Não somos responsáveis pelas práticas de privacidade desses outros sites. Incentivamos você a ler as políticas de privacidade de cada site que visitar.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-4">6. Alterações a esta Política</h2>
        <p>
          Podemos atualizar nossa Política de Privacidade periodicamente. Notificaremos sobre quaisquer alterações, publicando a nova política nesta página.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-4">Contato</h2>
        <p>
          Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco através da nossa <Link href="/contato">página de contato</Link>.
        </p>
        <p className="text-sm text-gray-500">
          Última atualização: 31 de Janeiro de 2026.
        </p>
      </div>
    </div>
  );
}
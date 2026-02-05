import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Licenciamento | Build-e-Byte",
  description: "Informações sobre os direitos autorais e o licenciamento do conteúdo publicado no portal Build-e-Byte.",
};

export default function LicensingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Licenciamento e Direitos Autorais</h1>
      <div className="prose prose-lg max-w-none">
        <p>
          Todo o conteúdo original publicado no portal <strong>Build-e-Byte</strong>, incluindo textos, análises, artigos, guias, imagens, gráficos e o box "Visão do Analista", é protegido por leis de direitos autorais.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-4">1. Propriedade Intelectual</h2>
        <p>
          O conteúdo é de propriedade exclusiva do Build-e-Byte e de seus autores. O nome, a marca e o logotipo "Build-e-Byte" são marcas registradas e não podem ser utilizados sem autorização prévia por escrito.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-4">2. Uso do Conteúdo</h2>
        <p>
          <strong>© Build-e-Byte. Todos os direitos reservados.</strong>
        </p>
        <p>
          O que isso significa:
        </p>
        <ul>
          <li>
            <strong>Você não pode:</strong> Reproduzir, distribuir, modificar, criar trabalhos derivados, exibir publicamente, executar publicamente, republicar, baixar, armazenar ou transmitir qualquer material do nosso site, exceto o estritamente necessário para a sua visualização pessoal e não comercial.
          </li>
          <li>
            <strong>Você pode:</strong> Compartilhar links para os nossos artigos em redes sociais ou outros sites, desde que o compartilhamento não implique em uma apropriação do conteúdo e que o crédito ao Build-e-Byte como fonte original seja claro e proeminente.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-6 mb-4">3. Citações e Referências</h2>
        <p>
          Pequenos trechos do nosso conteúdo podem ser citados, desde que a citação seja acompanhada de uma atribuição clara e um link direto para o artigo original no portal Build-e-Byte. A citação deve seguir as normas de uso justo (fair use) e não deve constituir a maior parte do seu próprio trabalho.
        </p>
        <p>
          Exemplo de atribuição correta:
        </p>
        <blockquote className="border-l-4 pl-4 italic">
          <p>
            "O colapso da arquitetura legada está reescrevendo as regras de ouro da tecnologia." - Build-e-Byte
          </p>
        </blockquote>

        <h2 className="text-2xl font-bold mt-6 mb-4">4. Conteúdo Gerado por IA</h2>
        <p>
          Parte do nosso processo de criação pode envolver ferramentas de Inteligência Artificial para pesquisa e estruturação inicial. No entanto, todo o conteúdo final é rigorosamente revisado, editado e validado por nossos analistas para garantir a precisão técnica, a originalidade e o alinhamento com nosso tom de voz e pilares editoriais. A responsabilidade e a autoria final do conteúdo são inteiramente humanas e pertencem à equipe do Build-e-Byte.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-4">5. Contato</h2>
        <p>
          Para qualquer questão relacionada a licenciamento, parcerias ou permissões de uso que excedam o escopo desta licença, por favor, entre em contato conosco.
        </p>
      </div>
    </div>
  );
}

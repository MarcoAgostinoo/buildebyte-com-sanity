/**
 * ============================================================================
 * PILLAR HEADER - Título + Descrição do Pilar
 * ============================================================================
 */

import { FC } from "react";
import { Pillar } from "@/app/lib/types";

interface PillarHeaderProps {
  pillar: Pillar;
}

export const PillarHeader: FC<PillarHeaderProps> = ({ pillar }) => {
  return (
    <header className="py-12 bg-gradient-to-b from-blue-50 to-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
          {pillar.title}
        </h1>
        {pillar.description && (
          <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">
            {pillar.description}
          </p>
        )}
      </div>
    </header>
  );
};

export default PillarHeader;

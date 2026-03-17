'use client';

import dynamic from 'next/dynamic';
import { Episode } from '@/app/lib/podcast-service';

const PodcastSection = dynamic(() => import('./PodcastSection'), {
  ssr: false,
  loading: () => <div className="h-full min-h-[400px] animate-pulse bg-gray-200 dark:bg-zinc-900 rounded-lg" />,
});

type PodcastSectionClientProps = {
  episodes: Episode[];
};

export default function PodcastSectionClient({ episodes }: PodcastSectionClientProps) {
  return <PodcastSection episodes={episodes} />;
}

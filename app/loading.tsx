export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-8 bg-gray-200 dark:bg-zinc-800 rounded w-1/4 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 lg:row-span-2 h-96 bg-gray-200 dark:bg-zinc-800 " />
        <div className="lg:col-span-2 h-60 bg-gray-200 dark:bg-zinc-800 " />
        <div className="lg:col-span-2 h-60 bg-gray-200 dark:bg-zinc-800 " />
      </div>
    </div>
  );
}
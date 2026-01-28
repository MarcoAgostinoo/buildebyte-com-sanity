export default function AdComponent({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-gray-200 p-4 rounded-lg text-center text-gray-500 ${className}`}>
      <p>Espaço Publicitário</p>
    </div>
  );
}

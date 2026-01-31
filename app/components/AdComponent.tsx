export default function AdComponent({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-primary/10 p-4 rounded-lg text-center text-primary dark:text-primary-300 ${className}`}>
      <p>Espaço Publicİtárİo</p>
    </div>
  );
}

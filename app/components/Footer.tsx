export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-10">
      <div className="max-w-4xl mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} build-e-byte. Todos os direitos reservados.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="#" className="hover:underline">Facebook</a>
          <a href="#" className="hover:underline">Twitter</a>
          <a href="#" className="hover:underline">Instagram</a>
        </div>
      </div>
    </footer>
  );
}

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  // Create any shared layout or styles here
  return (
    <main className="flex min-h-screen flex-col items-center p-12 md:p-20 bg-[#000000] justify-between text-white">
      {children}
    </main>
  );
}

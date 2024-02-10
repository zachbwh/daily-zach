import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-12 md:p-20 bg-[#000000] justify-between">
      <div className="relative flex place-items-center flex-col">
        <Image
          className="relative mb-20"
          src="/daily-zach-icon.png"
          alt="Daily Zach Logo"
          width={180}
          height={180}
          priority
        />
        <h1 className="text-2xl md:text-4xl font-bold text-white text-center">
          Stay up to date with Zach selfies.
          <br />
          <br />
          Coming Soon!
        </h1>
      </div>

      <div className="grid text-center lg:max-w-5xl lg:w-full grid-cols-2 lg:text-left">
        <a
          href="/privacy-policy"
          className="rounded-lg border border-transparent"
        >
          <h2 className="mb-3 text-2xl font-semibold text-center text-slate-300">
            Privacy Policy
          </h2>
        </a>

        <a href="/terms" className="rounded-lg border border-transparent">
          <h2 className="mb-3 text-2xl font-semibold text-center text-slate-300">
            Terms of Service
          </h2>
        </a>
      </div>
    </main>
  );
}

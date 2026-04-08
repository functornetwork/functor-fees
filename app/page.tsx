import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-screen bg-bg">
      <Image
        src="/functor-white.svg"
        alt="Functor logo"
        width={180}
        height={48}
        priority
      />
      <h1 className="mt-6 text-2xl font-semibold text-fg tracking-tight">
        Protocol Fee Simulator
      </h1>
    </div>
  );
}

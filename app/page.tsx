import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col items-center justify-center w-full max-w-3xl py-32 px-16 text-center">
        
        {/* Welcome Text */}
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6">
          Welcome to Your App
        </h1>
        
        <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-md">
          Your personal tracking and analytics are just one click away.
        </p>

        {/* Dashboard Link / Button */}
        <Link 
          href="/dashboard" 
          className="flex h-12 items-center justify-center gap-2 rounded-full bg-indigo-600 px-8 text-white font-medium transition-all hover:bg-indigo-700 hover:scale-105 active:scale-95 shadow-md"
        >
          Go to Dashboard
        </Link>

      </main>
    </div>
  );
}
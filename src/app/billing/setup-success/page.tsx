export default function SetupSuccess() {
  return (
    <main className="min-h-screen flex items-center justify-center text-center">
      <div>
        <h1 className="text-2xl font-bold">
          Card added successfully
        </h1>
        <p className="mt-2 text-zinc-600">
          You can now analyze your content.
        </p>
        <a
          href="/"
          className="mt-6 inline-block rounded-lg bg-black px-5 py-3 text-white"
        >
          Back to home
        </a>
      </div>
    </main>
  );
}

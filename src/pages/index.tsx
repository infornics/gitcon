export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-b from-white via-white to-indigo-200">
      {/* Hero Section */}
      <div className="max-w-screen-lg w-full text-center space-y-6">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Welcome to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-indigo-600 to-black">
            Revine
          </span>
        </h1>
        <p className="text-xl sm:text-2xl text-gray-600 font-light">
          The modern, powerful, and streamlined React framework.
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="mt-8 flex space-x-4">
        <a
          href="#get-started"
          className="rounded-md bg-indigo-600 px-6 py-3 text-white font-semibold shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
        >
          Get Started
        </a>
        <a
          href="#docs"
          className="rounded-md bg-white px-6 py-3 text-indigo-600 font-semibold border border-indigo-200 shadow hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Read Docs
        </a>
      </div>

      {/* Features Section */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-screen-lg w-full">
        <a
          href="#fast"
          className="block rounded-xl border border-gray-200 bg-white p-6 shadow transition hover:shadow-xl hover:-translate-y-1"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Lightning Fast
          </h3>
          <p className="text-gray-600">
            Built on Vite for ultra-fast development and instant HMR.
          </p>
        </a>

        <a
          href="#routing"
          className="block rounded-xl border border-gray-200 bg-white p-6 shadow transition hover:shadow-xl hover:-translate-y-1"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Simple File-based Routing
          </h3>
          <p className="text-gray-600">
            Create pages in <code>src/pages</code> and Revine will handle the
            rest.
          </p>
        </a>

        <a
          href="#tailwind"
          className="block rounded-xl border border-gray-200 bg-white p-6 shadow transition hover:shadow-xl hover:-translate-y-1"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Tailwind Integration
          </h3>
          <p className="text-gray-600">
            Pre-configured for Tailwind CSS, so you can style quickly and
            easily.
          </p>
        </a>

        <a
          href="#dev-experience"
          className="block rounded-xl border border-gray-200 bg-white p-6 shadow transition hover:shadow-xl hover:-translate-y-1"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Great DX</h3>
          <p className="text-gray-600">
            Minimal config, fast builds, custom logging, and more.
          </p>
        </a>

        <a
          href="#abstract"
          className="block rounded-xl border border-gray-200 bg-white p-6 shadow transition hover:shadow-xl hover:-translate-y-1"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Abstracted Internals
          </h3>
          <p className="text-gray-600">
            A .revine folder houses the complex Vite config. Keep your root
            clean.
          </p>
        </a>

        <a
          href="#customize"
          className="block rounded-xl border border-gray-200 bg-white p-6 shadow transition hover:shadow-xl hover:-translate-y-1"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Fully Customizable
          </h3>
          <p className="text-gray-600">
            Easily extend or override settings in <code>revine.config.ts</code>.
          </p>
        </a>
      </div>
    </main>
  );
}

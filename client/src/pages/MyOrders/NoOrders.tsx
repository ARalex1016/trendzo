import { useNavigate } from "react-router-dom";

const NoOrders = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto relative w-full max-w-lg overflow-hidden rounded-3xl border border-zinc-200 bg-white p-10 shadow-[0_20px_80px_rgba(0,0,0,0.08)] dark:border-zinc-800 dark:bg-zinc-900">
      {/* Background Glow */}
      <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-orange-200/40 blur-3xl dark:bg-orange-500/10" />
      <div className="absolute -bottom-20 -right-20 h-52 w-52 rounded-full bg-amber-200/40 blur-3xl dark:bg-amber-500/10" />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Icon */}
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-orange-400 to-amber-500 shadow-lg shadow-orange-500/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="h-12 w-12 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h1.5l.4 2m0 0L6 11h12l2-6H5.4M6 11l-1 5h13m-9 4a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
            />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          No Orders Yet
        </h2>

        {/* Subtitle */}
        <p className="mt-3 max-w-md text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          Looks like you haven’t placed any orders yet. Start exploring products
          and your orders will appear here beautifully.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => navigate("/products")}
            className="rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] hover:bg-black dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Start Shopping
          </button>

          {/* <button className="rounded-xl border border-zinc-300 bg-white px-6 py-3 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800">
              Browse Categories
            </button> */}
        </div>
      </div>
    </div>
  );
};

export default NoOrders;

import type { Provider } from "@/core/types";
import { ProviderCard } from "./ProviderCard";

export function ProviderGrid({
  providers,
  columns = 3,
}: {
  providers: Provider[];
  columns?: 2 | 3;
}) {
  return (
    <div
      className={
        columns === 2
          ? "grid gap-4 sm:grid-cols-2"
          : "grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      }
    >
      {providers.map((p) => (
        <ProviderCard key={p.id} provider={p} />
      ))}
    </div>
  );
}

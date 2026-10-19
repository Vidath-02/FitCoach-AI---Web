/**
 * Fixed, page-wide atmosphere: soft colour glows and a faint grid.
 * Pure CSS so it costs nothing at runtime. The glows are radial gradients rather than
 * blurred discs: a 140px `filter: blur` on a screen-sized layer is very slow on phones.
 */
export function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-ink" />
      <div className="bg-grid mask-radial absolute inset-0 opacity-60" />
      <div className="absolute -left-[20%] -top-[25%] h-[70vmax] w-[70vmax] bg-[radial-gradient(closest-side,rgb(200_255_61/0.07),rgb(200_255_61/0.035)_55%,transparent)]" />
      <div className="absolute -right-[25%] top-[30%] h-[60vmax] w-[60vmax] bg-[radial-gradient(closest-side,rgb(61_224_255/0.06),rgb(61_224_255/0.03)_55%,transparent)]" />
      <div className="absolute bottom-[-30%] left-[20%] h-[50vmax] w-[50vmax] bg-[radial-gradient(closest-side,rgb(139_123_255/0.05),rgb(139_123_255/0.025)_55%,transparent)]" />
    </div>
  );
}

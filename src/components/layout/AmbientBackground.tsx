/**
 * Fixed, page-wide atmosphere: soft colour glows and a faint grid.
 * Pure CSS so it costs nothing at runtime.
 */
export function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-ink" />
      <div className="bg-grid mask-radial absolute inset-0 opacity-60" />
      <div className="absolute -left-[20%] -top-[25%] h-[70vmax] w-[70vmax] rounded-full bg-volt/[0.07] blur-[140px]" />
      <div className="absolute -right-[25%] top-[30%] h-[60vmax] w-[60vmax] rounded-full bg-cyan/[0.06] blur-[150px]" />
      <div className="absolute bottom-[-30%] left-[20%] h-[50vmax] w-[50vmax] rounded-full bg-violet/[0.05] blur-[160px]" />
    </div>
  );
}

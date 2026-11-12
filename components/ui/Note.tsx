import type { ReactNode } from "react";

/** Caveats and method notes. Set apart by a rule and a small label, not a box. */
export function Note({ label, children }: { label: string; children: ReactNode }) {
  return (
    <aside className="note">
      <p className="note__label">{label}</p>
      <div className="note__body">{children}</div>
    </aside>
  );
}

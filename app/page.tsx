import { Masthead } from "@/components/chrome/Masthead";
import { Rail } from "@/components/chrome/Rail";
import { AccuracySection } from "@/components/sections/accuracy";
import { AnalysesSection } from "@/components/sections/analyses";
import { ChangesSection } from "@/components/sections/changes";
import { ComparedSection } from "@/components/sections/compared";
import { CostSection } from "@/components/sections/cost";
import { ITBenchSection } from "@/components/sections/itbench-section";
import { LandscapeSection } from "@/components/sections/landscape";
import { LimitsSection } from "@/components/sections/limits";
import { ProductionSection } from "@/components/sections/production";
import { SafetySection } from "@/components/sections/safety";
import { SummarySection } from "@/components/sections/summary";

export default function Page() {
  return (
    <div className="shell">
      <Rail />
      <main id="main" className="main">
        <Masthead />
        <SummarySection />
        <ComparedSection />
        <AccuracySection />
        <CostSection />
        <SafetySection />
        <ChangesSection />
        <ITBenchSection />
        <ProductionSection />
        <LandscapeSection />
        <AnalysesSection />
        <LimitsSection />
        <footer className="colophon">
          <div>
            <p className="colophon__title">Lear benchmark report</p>
            <p>12 November 2026 · Protocol v1.5</p>
            <p>
              <a href="/report/lear-benchmark-report.pdf" download>
                Download the PDF
              </a>
            </p>
          </div>
          <ul>
            <li>
              Recomputed from raw answers in <code>evals/results/bench/</code>
            </li>
            <li>
              Generator: <code>docs/benchmarks/report/build.py</code>
            </li>
            <li>
              Method and amendments: <code>evals/bench/PROTOCOL.md</code>
            </li>
            <li>
              Threats: <code>docs/benchmarks/VALIDITY.md</code>
            </li>
            <li>
              Rerun: <code>docs/benchmarks/README.md</code>
            </li>
          </ul>
        </footer>
      </main>
    </div>
  );
}

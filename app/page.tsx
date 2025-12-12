import { AframeScene } from "@/components/AframeScene";

export default function Page() {
  return (
    <main>
      <div className="page-shell">
        <div className="card">
          <h1>Démo A-Frame (Next.js + TypeScript)</h1>
          <p>
            Pointez ou cliquez sur le panneau pour déclencher l&apos;action. La
            scène fonctionne avec la souris, le curseur gaze et les contrôleurs
            VR (laser-controls).
          </p>
          <AframeScene />
        </div>
      </div>
    </main>
  );
}


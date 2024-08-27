import { TimersManager } from "@/components";

export default function Home() {
  return (
    <div>
      <h1 className="text-center text-3xl font-bold my-4">Timers</h1>
      <TimersManager />
    </div>
  );
}

import type { TelemetryEvent, TelemetryEventName } from "@worldforge/types";

// Minimal telemetry hook. Swap the sink for a real analytics provider later;
// nothing else in the codebase should call console/fetch directly for events.
export type TelemetrySink = (event: TelemetryEvent) => void;

let sink: TelemetrySink = (event) => {
  // eslint-disable-next-line no-console
  console.log("[telemetry]", event.name, event.properties ?? {});
};

export function setTelemetrySink(next: TelemetrySink): void {
  sink = next;
}

export function track(
  name: TelemetryEventName,
  properties?: Record<string, unknown>,
  playerId?: string,
): void {
  sink({
    name,
    playerId,
    timestamp: new Date().toISOString(),
    properties,
  });
}

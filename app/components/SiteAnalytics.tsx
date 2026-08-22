"use client";

import { AnchorHTMLAttributes, MouseEvent, useEffect } from "react";

type EventName = "plan_click" | "book_click" | "sample_click" | "social_click" | "press_click";

function sendEvent(event: "page_view" | EventName, path: string) {
  const body = JSON.stringify({ event, path });
  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    navigator.sendBeacon("/api/events", new Blob([body], { type: "application/json" }));
    return;
  }
  void fetch("/api/events", { method: "POST", headers: { "content-type": "application/json" }, body, keepalive: true });
}

export function PageAnalytics({ path }: { path: string }) {
  useEffect(() => sendEvent("page_view", path), [path]);
  return null;
}

type TrackedLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { eventName: EventName };

export function TrackedLink({ eventName, onClick, ...props }: TrackedLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    sendEvent(eventName, window.location.pathname);
    onClick?.(event);
  }

  return <a {...props} onClick={handleClick} />;
}

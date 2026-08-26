import { env } from "cloudflare:workers";

type Statement = {
  bind: (...values: unknown[]) => Statement;
  first: <T>() => Promise<T | null>;
  run: () => Promise<unknown>;
  all: <T>() => Promise<{ results?: T[] }>;
};

type Database = { prepare: (query: string) => Statement };

export type WaitlistEntry = { email: string; created_at: string };

export type AdminDashboard = {
  totalViews: number;
  last30Views: number;
  planClicks: number;
  bookClicks: number;
  sampleClicks: number;
  socialClicks: number;
  pressClicks: number;
  waitlistCount: number;
  newsletterCount: number;
  recentWaitlist: WaitlistEntry[];
  recentNewsletter: WaitlistEntry[];
};

const emptyDashboard: AdminDashboard = {
  totalViews: 0,
  last30Views: 0,
  planClicks: 0,
  bookClicks: 0,
  sampleClicks: 0,
  socialClicks: 0,
  pressClicks: 0,
  waitlistCount: 0,
  newsletterCount: 0,
  recentWaitlist: [],
  recentNewsletter: [],
};

function database(): Database | null {
  return (env as unknown as { DB?: Database }).DB ?? null;
}

async function ensureNewsletterTable(db: Database): Promise<void> {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS site_newsletter_subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `).run();
}

export async function recordSiteEvent(eventType: string, path: string, referrerHost: string): Promise<void> {
  const db = database();
  if (!db) return;
  await db
    .prepare("INSERT INTO site_events (event_type, path, referrer_host) VALUES (?, ?, ?)")
    .bind(eventType, path, referrerHost)
    .run();
}

export async function joinJourneyWaitlist(email: string): Promise<void> {
  const db = database();
  if (!db) throw new Error("A lista de interessados ainda não está disponível.");
  await db
    .prepare("INSERT INTO journey_waitlist (email) VALUES (?) ON CONFLICT(email) DO NOTHING")
    .bind(email)
    .run();
  await notifyEmailAutomation("journey", email);
}

export async function joinNewsletter(email: string): Promise<void> {
  const db = database();
  if (!db) throw new Error("O cadastro de novidades ainda não está disponível.");
  await ensureNewsletterTable(db);
  await db
    .prepare("INSERT INTO site_newsletter_subscribers (email) VALUES (?) ON CONFLICT(email) DO NOTHING")
    .bind(email)
    .run();
  await notifyEmailAutomation("newsletter", email);
}

async function notifyEmailAutomation(list: "journey" | "newsletter", email: string): Promise<void> {
  const runtime = env as unknown as { EMAIL_AUTOMATION_WEBHOOK_URL?: string; EMAIL_AUTOMATION_WEBHOOK_SECRET?: string };
  if (!runtime.EMAIL_AUTOMATION_WEBHOOK_URL) return;
  try {
    await fetch(runtime.EMAIL_AUTOMATION_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(runtime.EMAIL_AUTOMATION_WEBHOOK_SECRET ? { authorization: `Bearer ${runtime.EMAIL_AUTOMATION_WEBHOOK_SECRET}` } : {}),
      },
      body: JSON.stringify({ list, email, registeredAt: new Date().toISOString() }),
    });
  } catch {
    // O cadastro no site permanece válido mesmo se a automação externa estiver indisponível.
  }
}

export async function getAdminDashboard(): Promise<AdminDashboard> {
  const db = database();
  if (!db) return emptyDashboard;

  try {
    await ensureNewsletterTable(db);
    const [eventRows, waitlistRow, newsletterRow, recentWaitlist, recentNewsletter] = await Promise.all([
      db.prepare(`
        SELECT
          SUM(CASE WHEN event_type = 'page_view' THEN 1 ELSE 0 END) AS total_views,
          SUM(CASE WHEN event_type = 'page_view' AND created_at >= datetime('now', '-30 days') THEN 1 ELSE 0 END) AS last_30_views,
          SUM(CASE WHEN event_type = 'plan_click' THEN 1 ELSE 0 END) AS plan_clicks,
          SUM(CASE WHEN event_type = 'book_click' THEN 1 ELSE 0 END) AS book_clicks,
          SUM(CASE WHEN event_type = 'sample_click' THEN 1 ELSE 0 END) AS sample_clicks,
          SUM(CASE WHEN event_type = 'social_click' THEN 1 ELSE 0 END) AS social_clicks,
          SUM(CASE WHEN event_type = 'press_click' THEN 1 ELSE 0 END) AS press_clicks
        FROM site_events
      `).first<Record<string, number | null>>(),
      db.prepare("SELECT COUNT(*) AS count FROM journey_waitlist").first<{ count: number }>(),
      db.prepare("SELECT COUNT(*) AS count FROM site_newsletter_subscribers").first<{ count: number }>(),
      db.prepare("SELECT email, created_at FROM journey_waitlist ORDER BY created_at DESC LIMIT 8").all<WaitlistEntry>(),
      db.prepare("SELECT email, created_at FROM site_newsletter_subscribers ORDER BY created_at DESC LIMIT 8").all<WaitlistEntry>(),
    ]);

    return {
      totalViews: Number(eventRows?.total_views ?? 0),
      last30Views: Number(eventRows?.last_30_views ?? 0),
      planClicks: Number(eventRows?.plan_clicks ?? 0),
      bookClicks: Number(eventRows?.book_clicks ?? 0),
      sampleClicks: Number(eventRows?.sample_clicks ?? 0),
      socialClicks: Number(eventRows?.social_clicks ?? 0),
      pressClicks: Number(eventRows?.press_clicks ?? 0),
      waitlistCount: Number(waitlistRow?.count ?? 0),
      newsletterCount: Number(newsletterRow?.count ?? 0),
      recentWaitlist: recentWaitlist.results ?? [],
      recentNewsletter: recentNewsletter.results ?? [],
    };
  } catch {
    return emptyDashboard;
  }
}

export async function listWaitlist(): Promise<WaitlistEntry[]> {
  const db = database();
  if (!db) return [];
  try {
    const result = await db
      .prepare("SELECT email, created_at FROM journey_waitlist ORDER BY created_at DESC")
      .all<WaitlistEntry>();
    return result.results ?? [];
  } catch {
    return [];
  }
}

export async function listNewsletter(): Promise<WaitlistEntry[]> {
  const db = database();
  if (!db) return [];
  try {
    await ensureNewsletterTable(db);
    const result = await db
      .prepare("SELECT email, created_at FROM site_newsletter_subscribers ORDER BY created_at DESC")
      .all<WaitlistEntry>();
    return result.results ?? [];
  } catch {
    return [];
  }
}

import { clerkClient } from "@clerk/nextjs/server";

// Free conversions each signed-in user gets per day (resets at 00:00 UTC).
export const DAILY_LIMIT = Number(process.env.DAILY_LIMIT ?? 10);

type UsageMetadata = { usageDate?: string; usageCount?: number };

const today = () => new Date().toISOString().slice(0, 10);

/**
 * Usage is stored in the user's Clerk privateMetadata, so no database is needed.
 * privateMetadata is only readable/writable from the server.
 */
export async function getUsage(userId: string) {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const meta = user.privateMetadata as UsageMetadata;

    const used = meta.usageDate === today() ? meta.usageCount ?? 0 : 0;
    return { used, limit: DAILY_LIMIT, remaining: Math.max(0, DAILY_LIMIT - used) };
}

export async function recordUsage(userId: string, used: number) {
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
        privateMetadata: { usageDate: today(), usageCount: used + 1 },
    });
}

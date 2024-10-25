import { analyze } from "@/utils/ai";
import { getUserByClerkID } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const POST = async () => {
    const user = await getUserByClerkID();
    const entry = await prisma.journalEntry.create({
        data: {
            userId: user.id,
            content: "写一下你今天的经历!",
        }
    });
    const analysis = await analyze(entry.content) as any;
    await prisma.analysis.create({
        data: {
            entryId: entry.id,
            ...analysis
        }
    });
    revalidatePath('/journal');

    return NextResponse.json({ data: entry })
}
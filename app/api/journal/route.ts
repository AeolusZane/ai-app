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
            userId: user.id,
            entryId: entry.id,
            ...analysis
        }
    });
    revalidatePath('/journal');

    return NextResponse.json({ data: entry })
}

export const GET = async () => {
    const user = await getUserByClerkID();
    const entries = await prisma.journalEntry.findMany({
        where: {
            userId: user.id,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return NextResponse.json({ data: entries });
}
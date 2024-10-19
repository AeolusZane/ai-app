import { auth } from "@clerk/nextjs/server";
import { prisma } from "./db";
export const getUserByClerkID = async (opts: any = {}) => {
    const { userId } = await auth();

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            clerkId: userId as string,
        },
    });

    return user;
}
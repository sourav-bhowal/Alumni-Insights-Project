import {PrismaClient} from "@prisma/client"

// BOILER CODE FROM PRISMA DOCS
const PrismaClientSingleton = () => {
    return new PrismaClient();
};

declare global {
    var prismaGlobal: undefined | ReturnType<typeof PrismaClientSingleton>;
}

export const prisma = globalThis.prismaGlobal ?? PrismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
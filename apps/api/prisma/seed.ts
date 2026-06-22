import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const demoEmail = 'demo@manulife.com';
const demoPassword = 'Password123!';

async function main() {
    const hashedPassword = await bcrypt.hash(demoPassword, 10);

    const user = await prisma.user.upsert({
        where: { email: demoEmail },
        update: {
            passwordHash: hashedPassword,
            role: 'USER',
        },
        create: {
            email: demoEmail,
            passwordHash: hashedPassword,
            role: 'USER',
        },
    });

    await prisma.portfolio.deleteMany({
        where: { userId: user.id },
    });

    const portfolio = await prisma.portfolio.create({
        data: {
            userId: user.id,
            name: 'Manulife Growth Portfolio',
            description: 'Seeded demo portfolio for the dashboard.',
            investments: {
                create: [
                    {
                        name: 'Apple Inc.',
                        assetType: 'STOCK',
                        quantity: '15.0000',
                        purchasePrice: '182.5000',
                        currentPrice: '195.3000',
                        transactions: {
                            create: [
                                {
                                    type: 'BUY',
                                    quantity: '20.0000',
                                    price: '180.0000',
                                    transactionDate: new Date('2025-01-10T09:00:00.000Z'),
                                    notes: 'Initial accumulation',
                                },
                                {
                                    type: 'SELL',
                                    quantity: '5.0000',
                                    price: '190.0000',
                                    transactionDate: new Date('2025-04-18T09:00:00.000Z'),
                                    notes: 'Partial profit taking',
                                },
                            ],
                        },
                    },
                    {
                        name: 'Singapore Government Bond 2030',
                        assetType: 'BOND',
                        quantity: '10.0000',
                        purchasePrice: '101.2500',
                        currentPrice: '102.1000',
                        transactions: {
                            create: [
                                {
                                    type: 'BUY',
                                    quantity: '10.0000',
                                    price: '101.2500',
                                    transactionDate: new Date('2025-02-14T09:00:00.000Z'),
                                    notes: 'Income allocation',
                                },
                            ],
                        },
                    },
                    {
                        name: 'Manulife Global Equity Fund',
                        assetType: 'MUTUAL_FUND',
                        quantity: '120.0000',
                        purchasePrice: '25.4000',
                        currentPrice: '27.0500',
                        transactions: {
                            create: [
                                {
                                    type: 'BUY',
                                    quantity: '100.0000',
                                    price: '24.9000',
                                    transactionDate: new Date('2025-01-21T09:00:00.000Z'),
                                    notes: 'Core fund position',
                                },
                                {
                                    type: 'BUY',
                                    quantity: '20.0000',
                                    price: '27.9000',
                                    transactionDate: new Date('2025-05-06T09:00:00.000Z'),
                                    notes: 'Top-up allocation',
                                },
                            ],
                        },
                    },
                ],
            },
        },
        include: {
            investments: {
                include: {
                    transactions: true,
                },
            },
        },
    });

    console.log(`Seeded ${user.email} with portfolio ${portfolio.name}`);
    console.log(`Investments: ${portfolio.investments.length}`);
    console.log(
        `Transactions: ${portfolio.investments.reduce((count, investment) => count + investment.transactions.length, 0)}`
    );
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });

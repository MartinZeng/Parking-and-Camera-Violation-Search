import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { searchByPlate } from '@/lib/socrata';
import { sendNewTicketEmail } from '@/lib/email';
import { Violation } from '../../../types/index';

export async function POST(request: NextRequest) {
  try {
    const auth = request.headers.get('Authorization');
    if (auth !== `Bearer ${process.env.CRON_API_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscriptions = await prisma.subscription.findMany();

    const summary: {
      subscriptionId: number;
      plate: string;
      state: string;
      email: string;
      newTicketsCount: number;
    }[] = [];

    for (const sub of subscriptions) {
      try {
        const tickets = await searchByPlate(sub.plate);
        const summonsNumbers = tickets
          .map((t) => t.summons_number?.toString())
          .filter(Boolean) as string[];

        if (summonsNumbers.length === 0) continue;

        const existingTickets = await prisma.ticket.findMany({
          where: {
            plate: sub.plate,
          },
        });

        const existingSummons = new Set(
          existingTickets.map((t) => t.summons_number)
        );

        const newTickets = tickets.filter(
          (t) => !existingSummons.has(t.summons_number?.toString() || '')
        );

        if (newTickets.length > 0) {
          for (const t of newTickets) {
            const ticketRow = await prisma.ticket.create({
              data: {
                summonsNumber: t.summons_number.toString(),
                plate: t.plate,
                state: t.state,
                issueDate: t.issue_date,
                violation: t.violation,
                fineAmount: t.fine_amount,
              },
            });

            await sendNewTicketEmail({
              email: sub.email,
              plate: sub.plate,
              state: sub.state,
              ticket: ticketRow,
            });
          }

          summary.push({
            subscriptionId: sub.id,
            plate: sub.plate,
            state: sub.state,
            email: sub.email,
            newTicketsCount: newTickets.length,
          });
        }

        await prisma.subscription.update({
          where: { id: sub.id },
          data: { lastCheckedAt: new Date() },
        });
      } catch (subError) {
        console.error(`Error processing subscription ID ${sub.id}:`, subError);
      }
    }

    return NextResponse.json(
      { message: 'Ticket check completed', summary },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in ticket check cron job:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// app/api/cron/check-tickets/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { searchByPlate } from '@/lib/nycTickets';
import { sendNewTicketEmail } from '@/lib/email'; // we'll stub this

export async function POST(request: NextRequest) {
  try {
    const auth=request.headers.get('Authorization');
    if(auth!==`Bearer ${process.env.CRON_API_KEY}`){
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscriptions = await prisma.subscription.findMany();// Fetch all subscriptions from the database
    // Prepare summary of new tickets found
    const summry:{
        subscriptionId:number;
        plate:string;
        state:string;
        email:string;
        newTicketsCount:number; 
    }
    [] = [];// Array to hold summary of new tickets found


    // Iterate over each subscription to check for new tickets
    for (const sub of subscriptions) {
      try {
        const tickets = await searchByPlate(sub.plate);// Search for tickets by license plate
        const summonsNumbers = tickets.map(t => t.summonsNumber);// Extract summons numbers from fetched tickets
        
        if (summonsNumbers.length === 0) {
          continue; // No tickets found for this plate
        }
        
        const existingTickets = await prisma.ticket.findMany({
          where: {
            plate: sub.plate,
            state: sub.state,
          },
        });// Fetch existing tickets from the database
      const existingSummons = new Set(existingTickets.map(t => t.summonsNumber));// Create a set of existing summons numbers
        const newTickets = tickets.filter(t => !existingSummons.has(t.summonsNumber));// Identify new tickets not in the database
        if (newTickets.length > 0) {
          // Store new tickets in the database
          for (const ticket of newTickets) {
            await prisma.ticket.create({
              data: {
                summonsNumber: ticket.summonsNumber,
                plate: ticket.plate,
                state: ticket.state,
                issueDate: ticket.issueDate,
                violation: ticket.violation,
                fineAmount: ticket.fineAmount,
              },
            });
            await sendNewTicketEmail(sub.email, ticket);// Send email notification for the new ticket      
          }
            // Add to summary
            summry.push({
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
        });// Update the last checked timestamp for the subscription
      } catch (subError) {
        console.error(`Error processing subscription ID ${sub.id}:`, subError);
      }
    }

    return NextResponse.json({ message: 'Ticket check completed',summary:summry }, { status: 200 });
  } catch (error) {
    console.error('Error in ticket check cron job:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}   
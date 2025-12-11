import { NextRequest, NextResponse } from 'next/server';
import { searchByPlate } from '@/lib/socrata';
import type { Violation } from '@/app/types';

// API route to search for tickets by license plate
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const plate = (searchParams.get('plate') || '').trim();

    const violations: Violation[] = await searchByPlate(plate);

    // if you want to normalize for UI:
    const tickets = violations.map((v, idx) => ({
      id: v.summons_number?.toString() || idx.toString(),
      summons_number: v.summons_number?.toString() || '',
      plate: v.plate,
      state: v.state,
      issue_date: v.issue_date,
      violation: v.violation,
      fine_amount: v.fine_amount,
      amount_due: v.amount_due,
      county: v.county,
      location: v.summons_image,
    }));

    return NextResponse.json({
      plate: plate.toUpperCase(),
      count: tickets.length,
      tickets,
    });
  } catch (err) {
    console.error('Error in /api/tickets:', err);
    return NextResponse.json(
      { error: 'Server error while searching tickets' },
      { status: 500 }
    );
  }
}

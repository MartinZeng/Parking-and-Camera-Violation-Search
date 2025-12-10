import { NextRequest, NextResponse } from 'next/server';
import { searchByPlate } from '@/lib/socrata';
import type { Violation } from '@/app/types';

// API route to search for tickets by license plate
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const plate = (searchParams.get('plate') || '').trim();
    const state = (searchParams.get('state') || '').trim();

    if (!plate) {
      return NextResponse.json(
        { error: 'Missing plate query parameter' },
        { status: 400 },
      );
    }

    const violations: Violation[] = await searchByPlate(plate, state || undefined);

    // if you want to normalize for UI:
    const tickets = violations.map((v, idx) => ({
      id: v.summons_number?.toString() || idx.toString(),
      summonsNumber: v.summons_number?.toString() || '',
      plate: v.plate,
      state: v.state,
      issueDate: v.issue_date,
      violation: v.violation,
      fineAmount: v.fine_amount,
    }));

    return NextResponse.json({
      plate: plate.toUpperCase(),
      state: state || null,
      count: tickets.length,
      tickets,
    });
  } catch (err) {
    console.error('Error in /api/tickets:', err);
    return NextResponse.json(
      { error: 'Server error while searching tickets' },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function cleanPlate(plate: string): string {
  return plate.replace(/[^A-Z0-9]/gi, '').toUpperCase();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 },
      );
    }

    let { email, plate, state } = body as {
      email?: string;
      plate?: string;
      state?: string;
    };

    console.log('Incoming body:', body);

    if (!email || !plate || !state) {
      return NextResponse.json(
        { error: 'Email, license plate, and state are required' },
        { status: 400 },
      );
    }

    email = email.toLowerCase().trim();
    plate = cleanPlate(plate);
    state = state.toUpperCase().trim();

    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 },
      );
    }

    if (!plate) {
      return NextResponse.json(
        { error: 'Invalid license plate' },
        { status: 400 },
      );
    }

    console.log('Normalized values:', { email, plate, state });

    const existing = await prisma.subscription.findFirst({
      where: { email, plate, state },
    });

    console.log('Existing subscription:', existing);

    if (existing) {
      return NextResponse.json(
        {
          message: 'Subscription already exists',
          alreadySubscribed: true,
          subscriptionId: existing.id,
        },
        { status: 200 },
      );
    }

    const sub = await prisma.subscription.create({
      data: { email, plate, state },
    });

    console.log('Created subscription:', sub);

    return NextResponse.json(
      {
        message: 'Subscription created successfully',
        subscription: sub,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error('Error creating subscription:', error);

    // TEMP: expose message for debugging
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Internal Server Error', detail: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: 'Internal Server Error', detail: 'Unknown error' },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


function cleanPlate(plate: string): string {
  return plate.replace(/[^A-Z0-9]/gi, '').toUpperCase();
}


export async function POST(request: NextRequest) {
    try {
        const body = await request.json().catch(() => null);// Parse the JSON body of the request
        if (!body || !body.plate) {
            return NextResponse.json({ error: 'License plate is required' }, { status: 400 });
        }
        // Destructure and validate input
        let { email,plate,state } = body as { email: string; plate: string; state: string; };// Destructure email and plate from the request body
        if (!email || !plate || !state) {
            return NextResponse.json({ error: 'Email, license plate, and state are required' }, { status: 400 });
        }

        email = email.toLowerCase().trim();// Normalize email
        plate = cleanPlate(plate);// Clean license plate input
        state = state.toUpperCase().trim();// Normalize state
        
        // Basic email format validation
        if(!email.includes('@')){
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }
        if(!plate){
            return NextResponse.json({ error: 'Invalid license plate' }, { status: 400 });
        }

        // Check for existing subscription
        const existing = await prisma.subscription.findFirst({
            where: {
                email,
                plate,
                state,
            },
        });

        if (existing) {
            return NextResponse.json({ message: 'Subscription already exists' }, { status: 200 });
        }
        // Create new subscription
        const sub=await prisma.subscription.create({
            data: {
                email,
                plate,
                state,
            },
        });

        return NextResponse.json({ message: 'Subscription created successfully',subscription:sub }, { status: 201 });
    } catch (error) {
        console.error('Error creating subscription:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
import { NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';

export async function GET() {
  try {
    const data = await prisma.services.findMany({
      orderBy: { id: 'desc' },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { sectionLabel, heading, items } = body;

    if (!items) {
      return NextResponse.json(
        { success: false, error: 'items is required' },
        { status: 400 }
      );
    }

    const created = await prisma.services.create({
      data: {
        sectionLabel,
        heading,
        items,
      },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating services:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create services' },
      { status: 500 }
    );
  }
}

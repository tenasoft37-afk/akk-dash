import { NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';

export async function GET() {
  try {
    const data = await prisma.expertise.findMany({
      orderBy: { id: 'desc' },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching expertise:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch expertise' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { sectionLabel, heading, tools, odooHeading, odooDescription, odooServices } = body;

    if (!tools || !odooDescription || !odooServices) {
      return NextResponse.json(
        { success: false, error: 'tools, odooDescription, and odooServices are required' },
        { status: 400 }
      );
    }

    const created = await prisma.expertise.create({
      data: {
        sectionLabel,
        heading,
        tools,
        odooHeading,
        odooDescription,
        odooServices,
      },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating expertise:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create expertise' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';

export async function GET() {
  try {
    const data = await prisma.contactSection.findMany({
      orderBy: { id: 'desc' },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching contact section:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contact section' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { ctaHeading, ctaText, ctaButton, contacts, locations, footerText } = body;

    if (!ctaText || !contacts || !locations || !footerText) {
      return NextResponse.json(
        { success: false, error: 'ctaText, contacts, locations, and footerText are required' },
        { status: 400 }
      );
    }

    const created = await prisma.contactSection.create({
      data: {
        ctaHeading,
        ctaText,
        ctaButton,
        contacts,
        locations,
        footerText,
      },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating contact section:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create contact section' },
      { status: 500 }
    );
  }
}

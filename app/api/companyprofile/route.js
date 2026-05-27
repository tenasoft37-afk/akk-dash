import { NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';

export async function GET() {
  try {
    const data = await prisma.companyProfile.findMany({
      orderBy: { id: 'desc' },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching company profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch company profile' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { sectionLabel, heading, pillar1Title, pillar1Text, pillar2Title, pillar2Text, pillar3Title, pillar3Text } = body;

    if (!pillar1Text || !pillar2Text || !pillar3Text) {
      return NextResponse.json(
        { success: false, error: 'pillar1Text, pillar2Text, and pillar3Text are required' },
        { status: 400 }
      );
    }

    const created = await prisma.companyProfile.create({
      data: {
        sectionLabel,
        heading,
        pillar1Title,
        pillar1Text,
        pillar2Title,
        pillar2Text,
        pillar3Title,
        pillar3Text,
      },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating company profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create company profile' },
      { status: 500 }
    );
  }
}

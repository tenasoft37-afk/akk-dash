import { NextResponse } from 'next/server';
import prisma from '../../../libs/prismadb';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const record = await prisma.companyProfile.findUnique({ where: { id } });
    if (!record) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error('Error fetching company profile:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch company profile' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await prisma.companyProfile.update({
      where: { id },
      data: {
        ...(body.sectionLabel !== undefined && { sectionLabel: body.sectionLabel }),
        ...(body.heading !== undefined && { heading: body.heading }),
        ...(body.pillar1Title !== undefined && { pillar1Title: body.pillar1Title }),
        ...(body.pillar1Text !== undefined && { pillar1Text: body.pillar1Text }),
        ...(body.pillar2Title !== undefined && { pillar2Title: body.pillar2Title }),
        ...(body.pillar2Text !== undefined && { pillar2Text: body.pillar2Text }),
        ...(body.pillar3Title !== undefined && { pillar3Title: body.pillar3Title }),
        ...(body.pillar3Text !== undefined && { pillar3Text: body.pillar3Text }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating company profile:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Failed to update company profile' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.companyProfile.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting company profile:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Failed to delete company profile' }, { status: 500 });
  }
}

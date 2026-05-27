import { NextResponse } from 'next/server';
import prisma from '../../../libs/prismadb';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const record = await prisma.about.findUnique({ where: { id } });
    if (!record) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error('Error fetching about:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch about' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await prisma.about.update({
      where: { id },
      data: {
        ...(body.sectionLabel !== undefined && { sectionLabel: body.sectionLabel }),
        ...(body.heading !== undefined && { heading: body.heading }),
        ...(body.paragraph1 !== undefined && { paragraph1: body.paragraph1 }),
        ...(body.paragraph2 !== undefined && { paragraph2: body.paragraph2 }),
        ...(body.paragraph3 !== undefined && { paragraph3: body.paragraph3 }),
        ...(body.ctaText !== undefined && { ctaText: body.ctaText }),
        ...(body.ctaLink !== undefined && { ctaLink: body.ctaLink }),
        ...(body.stats !== undefined && { stats: body.stats }),
        ...(body.image !== undefined && { image: body.image }),
        ...(body.videoUrl !== undefined && { videoUrl: body.videoUrl }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating about:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Failed to update about' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.about.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting about:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Failed to delete about' }, { status: 500 });
  }
}

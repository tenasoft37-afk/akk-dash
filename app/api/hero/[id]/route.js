import { NextResponse } from 'next/server';
import prisma from '../../../libs/prismadb';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const record = await prisma.hero.findUnique({ where: { id } });
    if (!record) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error('Error fetching hero:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch hero' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await prisma.hero.update({
      where: { id },
      data: {
        ...(body.heading !== undefined && { heading: body.heading }),
        ...(body.subtitle !== undefined && { subtitle: body.subtitle }),
        ...(body.highlights !== undefined && { highlights: body.highlights }),
        ...(body.stats !== undefined && { stats: body.stats }),
        ...(body.image !== undefined && { image: body.image }),
        ...(body.ctaText1 !== undefined && { ctaText1: body.ctaText1 }),
        ...(body.ctaLink1 !== undefined && { ctaLink1: body.ctaLink1 }),
        ...(body.ctaText2 !== undefined && { ctaText2: body.ctaText2 }),
        ...(body.ctaLink2 !== undefined && { ctaLink2: body.ctaLink2 }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating hero:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Failed to update hero' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.hero.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting hero:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Failed to delete hero' }, { status: 500 });
  }
}

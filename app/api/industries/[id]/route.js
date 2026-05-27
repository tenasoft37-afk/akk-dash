import { NextResponse } from 'next/server';
import prisma from '../../../libs/prismadb';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const record = await prisma.industries.findUnique({ where: { id } });
    if (!record) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error('Error fetching industries:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch industries' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await prisma.industries.update({
      where: { id },
      data: {
        ...(body.sectionLabel !== undefined && { sectionLabel: body.sectionLabel }),
        ...(body.heading !== undefined && { heading: body.heading }),
        ...(body.subtitle !== undefined && { subtitle: body.subtitle }),
        ...(body.spotlightTitle !== undefined && { spotlightTitle: body.spotlightTitle }),
        ...(body.spotlightDesc !== undefined && { spotlightDesc: body.spotlightDesc }),
        ...(body.spotlightImage !== undefined && { spotlightImage: body.spotlightImage }),
        ...(body.fmcgServices !== undefined && { fmcgServices: body.fmcgServices }),
        ...(body.items !== undefined && { items: body.items }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating industries:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Failed to update industries' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.industries.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting industries:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Failed to delete industries' }, { status: 500 });
  }
}

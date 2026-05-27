import { NextResponse } from 'next/server';
import prisma from '../../../libs/prismadb';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const record = await prisma.services.findUnique({ where: { id } });
    if (!record) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await prisma.services.update({
      where: { id },
      data: {
        ...(body.sectionLabel !== undefined && { sectionLabel: body.sectionLabel }),
        ...(body.heading !== undefined && { heading: body.heading }),
        ...(body.items !== undefined && { items: body.items }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating services:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Failed to update services' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.services.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting services:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Failed to delete services' }, { status: 500 });
  }
}

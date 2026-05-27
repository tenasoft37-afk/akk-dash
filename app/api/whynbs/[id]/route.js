import { NextResponse } from 'next/server';
import prisma from '../../../libs/prismadb';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const record = await prisma.whyNBS.findUnique({ where: { id } });
    if (!record) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error('Error fetching why NBS:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch why NBS' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await prisma.whyNBS.update({
      where: { id },
      data: {
        ...(body.sectionLabel !== undefined && { sectionLabel: body.sectionLabel }),
        ...(body.heading !== undefined && { heading: body.heading }),
        ...(body.differentiators !== undefined && { differentiators: body.differentiators }),
        ...(body.counters !== undefined && { counters: body.counters }),
        ...(body.bgImage !== undefined && { bgImage: body.bgImage }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating why NBS:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Failed to update why NBS' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.whyNBS.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting why NBS:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Failed to delete why NBS' }, { status: 500 });
  }
}

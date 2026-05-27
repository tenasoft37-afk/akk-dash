import { NextResponse } from 'next/server';
import prisma from '../../../libs/prismadb';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const record = await prisma.valueProposition.findUnique({ where: { id } });
    if (!record) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error('Error fetching value proposition:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch value proposition' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await prisma.valueProposition.update({
      where: { id },
      data: {
        ...(body.sectionLabel !== undefined && { sectionLabel: body.sectionLabel }),
        ...(body.heading !== undefined && { heading: body.heading }),
        ...(body.painPoints !== undefined && { painPoints: body.painPoints }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating value proposition:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Failed to update value proposition' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.valueProposition.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting value proposition:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Failed to delete value proposition' }, { status: 500 });
  }
}

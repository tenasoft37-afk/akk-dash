import { NextResponse } from 'next/server';
import prisma from '../../../libs/prismadb';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const record = await prisma.contactSection.findUnique({ where: { id } });
    if (!record) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error('Error fetching contact section:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch contact section' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await prisma.contactSection.update({
      where: { id },
      data: {
        ...(body.ctaHeading !== undefined && { ctaHeading: body.ctaHeading }),
        ...(body.ctaText !== undefined && { ctaText: body.ctaText }),
        ...(body.ctaButton !== undefined && { ctaButton: body.ctaButton }),
        ...(body.contacts !== undefined && { contacts: body.contacts }),
        ...(body.locations !== undefined && { locations: body.locations }),
        ...(body.footerText !== undefined && { footerText: body.footerText }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating contact section:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Failed to update contact section' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.contactSection.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact section:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Failed to delete contact section' }, { status: 500 });
  }
}

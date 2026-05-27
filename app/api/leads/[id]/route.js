import { NextResponse } from 'next/server';
import prisma from '../../../libs/prismadb';

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.leadSubmission.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Failed to delete lead' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import prisma from '../../../libs/prismadb';
import { mergeVisibility } from '../../../constants/sectionVisibility';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await prisma.siteSettings.update({
      where: { id },
      data: {
        ...(body.visibility !== undefined && {
          visibility: mergeVisibility(body.visibility),
        }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating site settings:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update site settings' },
      { status: 500 }
    );
  }
}

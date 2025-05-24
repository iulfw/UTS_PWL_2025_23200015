import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const summary = await prisma.preorder.groupBy({
      by: ['selected_package'],
      _sum: {
        qty: true,
      },
    });

    return NextResponse.json(summary);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to Fetch PreOrder Summary.' }, { status: 500 });
  }
}
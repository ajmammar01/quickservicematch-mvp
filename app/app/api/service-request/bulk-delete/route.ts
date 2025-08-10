import { NextRequest, NextResponse } from 'next/server';
// 🚧 Hidden for MVP - Authentication
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/db';

// POST handler for bulk deletion of service requests
export async function POST(request: NextRequest) {
  try {
    // 🚧 Hidden for MVP - Authentication
    // const session = await getServerSession(authOptions);
    // if (!session || (session.user as any)?.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    
    // TODO: Re-enable authentication when not in MVP mode
    return NextResponse.json({ error: 'Endpoint disabled in MVP' }, { status: 403 });
    
    const { ids } = await request.json();
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request. Expected an array of IDs.' },
        { status: 400 }
      );
    }
    
    // Delete all service requests with the given IDs
    const result = await prisma.serviceRequest.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      message: `${result.count} service requests deleted successfully`
    });
  } catch (error) {
    console.error('Error deleting service requests:', error);
    return NextResponse.json(
      { error: 'Failed to delete service requests' },
      { status: 500 }
    );
  }
}

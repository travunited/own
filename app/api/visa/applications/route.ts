import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // TODO: Fetch from database
    // SELECT * FROM visa_applications WHERE user_id = ?

    // Mock data
    const applications = [
      {
        id: '1',
        applicationNumber: 'TRV12345',
        country: 'Dubai',
        visaType: 'Tourist - 30 Days',
        status: 'UNDER_REVIEW',
        travellers: 2,
        amount: 11000,
        createdAt: '2024-11-08T10:25:00',
      },
    ];

    return NextResponse.json({
      success: true,
      applications,
    });
  } catch (error: any) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}


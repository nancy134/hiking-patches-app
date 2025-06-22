// app/api/list-users/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const apiUrl = "https://zlshwrb5h6.execute-api.us-east-1.amazonaws.com/staging/list-users";

  // Extract the Authorization header (Bearer token)
  const authHeader = request.headers.get('authorization');
  console.log('Authorization header:', authHeader);

  try {
    const res = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader }), // only include if exists
      },
    });

    if (!res.ok) {
      throw new Error(`Lambda call failed: ${res.statusText}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error calling Lambda list-users:', error);
    return NextResponse.json({ error: 'Failed to call Lambda' }, { status: 500 });
  }
}


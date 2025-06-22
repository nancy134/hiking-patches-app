// app/api/list-users/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const apiUrl = process.env.LIST_USERS_API_URL; // or hardcode it for now

  try {
    const res = await fetch(apiUrl!, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`Lambda call failed: ${res.statusText}`);
    }

    const data = await res.json();
    console.log(data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error calling Lambda list-users:', error);
    return NextResponse.json({ error: 'Failed to call Lambda' }, { status: 500 });
  }
}


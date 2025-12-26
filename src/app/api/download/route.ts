import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { turso } from '@/lib/turso';

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id');
  
  if (!sessionId) {
    return NextResponse.json({ error: 'No session ID provided' }, { status: 400 });
  }

  try {
    // Verify session exists in Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (!session || session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Invalid or unpaid session' }, { status: 400 });
    }

    // Verify order exists in database
    const result = await turso.execute({
      sql: 'SELECT * FROM book_orders WHERE stripe_session_id = ?',
      args: [sessionId],
    });

    if (!result.rows.length) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Generate download URL
    // TODO: Replace with actual PDF path when book is uploaded
    // For now, points to /book.pdf in public directory
    const downloadUrl = '/book.pdf';
    
    return NextResponse.json({ downloadUrl });
  } catch (error) {
    console.error('Error generating download:', error);
    return NextResponse.json({ error: 'Failed to generate download' }, { status: 500 });
  }
}

// src/app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // Adjust import based on your auth setup
import { ProfileService } from '@/services/profile.service';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await ProfileService.getByUserId(session.user.id);
    
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Profile GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { user, profile } = body;

    // Validate email if provided
    if (user?.email) {
      const emailExists = await ProfileService.emailExists(user.email, session.user.id);
      if (emailExists) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 400 }
        );
      }
    }

    const updatedProfile = await ProfileService.updateCompleteProfile(
      session.user.id,
      { user, profile }
    );

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Profile PUT error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Avatar upload endpoint
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { avatar, preferredGenres } = body;

    if (avatar) {
      const updatedProfile = await ProfileService.updateAvatar(session.user.id, avatar);
      return NextResponse.json(updatedProfile);
    }

    if (preferredGenres) {
      const updatedProfile = await ProfileService.updatePreferredGenres(session.user.id, preferredGenres);
      return NextResponse.json(updatedProfile);
    }

    return NextResponse.json(
      { error: 'No valid fields to update' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Profile PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
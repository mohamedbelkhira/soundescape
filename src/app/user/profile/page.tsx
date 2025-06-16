// src/app/user/profile/page.tsx
import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // Adjust import based on your auth setup
import { ProfileService } from '@/services/profile.service';
import { redirect } from 'next/navigation';
import ProfilePage from './profilePage';

export default async function Page() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  try {
    // Fetch initial profile data on the server
    const profileData = await ProfileService.getByUserId(session.user.id);
    
    if (!profileData) {
      redirect('/auth/signin');
    }

    // Get user favorites and subscription info
    const [favorites, subscriptionInfo] = await Promise.all([
      ProfileService.getUserFavorites(session.user.id),
      ProfileService.getSubscriptionInfo(session.user.id),
    ]);
    console.log("Favorites:", favorites);
    console.log("Subscription Info:", subscriptionInfo);
    const initialData = {
      user: profileData,
      favorites,
      subscription: subscriptionInfo,
    };

    return (
      <div className="min-h-screen bg-background">
        <ProfilePage initialData={initialData} />
      </div>
    );
  } catch (error) {
    console.error('Profile page error:', error);
    redirect('/auth/signin');
  }
}
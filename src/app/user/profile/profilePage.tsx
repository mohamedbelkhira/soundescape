'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Mail, MapPin, Globe, Crown, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import type { CompleteProfileData } from '@/services/profile.service';

interface ProfilePageProps {
  initialData: {
    user: CompleteProfileData;
    favorites: any[];
    subscription: {
      subscriptionType: string;
      subscriptionExpiresAt: Date | null;
    } | null;
  };
}

export default function ProfilePage({ initialData }: ProfilePageProps) {
  const [userData, setUserData] = useState(initialData.user);
 


  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getSubscriptionBadge = (type: string) => {
    switch (type) {
      case 'PREMIUM':
        return (
          <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-50 border-0 shadow-md">
            <Crown className="w-3 h-3 mr-1" />
            Premium
          </Badge>
        );
      case 'PREMIUM_PLUS':
        return (
          <Badge className="bg-gradient-to-r from-purple-500 to-purple-700 text-purple-50 border-0 shadow-md">
            <Crown className="w-3 h-3 mr-1" />
            Premium Plus
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
            Free
          </Badge>
        );
    }
  };

  const InfoItem = ({ icon: Icon, label, value }: { icon: unknown, label: string, value: string | null }) => (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
      <div className="flex-shrink-0 mt-0.5">
        <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
          {label}
        </p>
        <p className="text-sm text-gray-900 dark:text-gray-100 break-words">
          {value || 'Not provided'}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
        <Card className="overflow-hidden shadow-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors duration-200">
        <CardContent className="p-6 sm:p-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
            {/* Avatar */}
            <div className="relative group">
              <Avatar className="h-24 w-24 sm:h-32 sm:w-32 ring-4 ring-gray-200 dark:ring-gray-600 transition-all group-hover:ring-gray-300 dark:group-hover:ring-gray-500">
                <AvatarImage 
                  src={userData.profile?.avatar || ''} 
                  alt={userData.name || ''} 
                  className="object-cover"
                />
                <AvatarFallback className="text-lg sm:text-2xl bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 text-blue-600 dark:text-blue-300 font-semibold">
                  {getInitials(userData.name)}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {userData.name || 'User'}
                </h1>
                {getSubscriptionBadge(userData.subscriptionType)}
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
                <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">{userData.email}</span>
              </div>

              {userData.profile?.bio && (
                <div className="mt-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {userData.profile.bio}
                  </p>
                </div>
              )}
            </div>

            {/* Edit Button */}
            {/* <Button
              onClick={() => setEditDialogOpen(true)}
              variant="outline"
              className="flex items-center gap-2 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all"
            >
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button> */}
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent mb-8"></div>

          {/* Information Grid */}
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            <InfoItem
              icon={User}
              label="Full Name"
              value={userData.name}
            />

            <InfoItem
              icon={Mail}
              label="Email Address"
              value={userData.email}
            />

            <InfoItem
              icon={MapPin}
              label="Country"
              value={userData.profile?.country}
            />

            <InfoItem
              icon={Globe}
              label="Language"
              value={userData.profile?.language?.toUpperCase()}
            />

            {userData.profile?.dateOfBirth && (
              <InfoItem
                icon={Calendar}
                label="Date of Birth"
                value={format(new Date(userData.profile.dateOfBirth), 'MMMM d, yyyy')}
              />
            )}

            <InfoItem
              icon={CalendarDays}
              label="Member Since"
              value={format(new Date(userData.createdAt), 'MMMM d, yyyy')}
            />
          </div>

          {/* Subscription Information */}
          {initialData.subscription && (
            <>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent my-8"></div>
              
              <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border border-blue-200 dark:border-blue-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <Crown className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Subscription Details
                </h3>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Plan Type
                    </p>
                    <div className="flex items-center gap-2">
                      {getSubscriptionBadge(initialData.subscription.subscriptionType)}
                    </div>
                  </div>
                  
                  {initialData.subscription.subscriptionExpiresAt && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                        Expires On
                      </p>
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        {format(new Date(initialData.subscription.subscriptionExpiresAt), 'MMMM d, yyyy')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
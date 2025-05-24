
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
}

export const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setProfile(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button 
            onClick={handleSignOut}
            variant="outline"
            className="bg-transparent border-white/20 text-white hover:bg-white/10"
          >
            Sign Out
          </Button>
        </div>

        {/* User Info Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 max-w-md">
          <div className="flex items-center space-x-4 mb-4">
            {profile?.avatar_url && (
              <img 
                src={profile.avatar_url} 
                alt="Profile" 
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <h2 className="text-xl font-semibold">
                {profile?.full_name || 'User'}
              </h2>
              <p className="text-white/70">
                {profile?.email || user?.email}
              </p>
            </div>
          </div>
          
          <div className="space-y-2 text-sm text-white/60">
            <p><span className="font-medium">User ID:</span> {user?.id}</p>
            <p><span className="font-medium">Last Sign In:</span> {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mt-8">
          <h3 className="text-2xl mb-4">Welcome to your Dashboard!</h3>
          <p className="text-white/70">
            You have successfully signed in with Google. This is where you can manage your account and access your data.
          </p>
        </div>
      </div>
    </div>
  );
};

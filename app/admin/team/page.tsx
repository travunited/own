'use client';

import { useState, useEffect } from 'react';
import { Briefcase, Plus, Mail, Phone, Edit, Trash2, Search } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function TeamPage() {
  const supabase = createClientComponentClient();
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    try {
      const { data, error} = await supabase
        .from('user_profiles')
        .select('*')
        .in('role', ['super_admin', 'admin', 'sub_admin', 'regional_admin', 'maintenance_admin'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTeam(data || []);
    } catch (error) {
      console.error('Error loading team:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
            <p className="text-gray-600 mt-2">Manage your admin team</p>
          </div>
          <button className="btn-primary flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Add Team Member
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-lg">
                      {member.full_name?.charAt(0) || member.username?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{member.full_name || member.username}</h3>
                    <span className="text-xs px-2 py-0.5 bg-primary-100 text-primary-800 rounded-full">
                      {member.role?.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-900 p-1">
                  <Edit className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 mb-4">
                {member.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {member.phone}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Joined {new Date(member.created_at).toLocaleDateString()}
                </span>
                <button className="text-red-600 hover:text-red-900 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {team.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No team members found</p>
          </div>
        )}
      </div>
    </div>
  );
}


'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Upload, Linkedin, Twitter, Mail, Award, MoveUp, MoveDown } from 'lucide-react';

interface TeamMember {
  id: string;
  full_name: string;
  position: string;
  department: 'leadership' | 'team';
  bio: string;
  profile_image_url?: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  twitter_url?: string;
  display_order: number;
  is_active: boolean;
  is_featured: boolean;
}

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<TeamMember>>({
    full_name: '',
    position: '',
    department: 'team',
    bio: '',
    email: '',
    phone: '',
    linkedin_url: '',
    twitter_url: '',
    display_order: 0,
    is_active: true,
    is_featured: false,
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/admin/team');
      const data = await response.json();
      setMembers(data.members || []);
    } catch (error) {
      console.error('Failed to fetch team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingId ? `/api/admin/team/${editingId}` : '/api/admin/team';
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchMembers();
        resetForm();
      }
    } catch (error) {
      console.error('Failed to save team member:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;
    
    try {
      const response = await fetch(`/api/admin/team/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchMembers();
      }
    } catch (error) {
      console.error('Failed to delete team member:', error);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setFormData(member);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({
      full_name: '',
      position: '',
      department: 'team',
      bio: '',
      email: '',
      phone: '',
      linkedin_url: '',
      twitter_url: '',
      display_order: 0,
      is_active: true,
      is_featured: false,
    });
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const index = members.findIndex(m => m.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === members.length - 1)
    ) {
      return;
    }

    const newMembers = [...members];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newMembers[index], newMembers[targetIndex]] = [newMembers[targetIndex], newMembers[index]];

    // Update display orders
    newMembers.forEach((member, idx) => {
      member.display_order = idx + 1;
    });

    setMembers(newMembers);

    // Save to backend
    try {
      await fetch(`/api/admin/team/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_order: newMembers[targetIndex].display_order }),
      });
    } catch (error) {
      console.error('Failed to reorder:', error);
    }
  };

  const leadership = members.filter(m => m.department === 'leadership');
  const team = members.filter(m => m.department === 'team');

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600 mt-1">Manage your team member profiles</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Team Member
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {editingId ? 'Edit Team Member' : 'Add New Team Member'}
            </h2>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position *
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value as 'leadership' | 'team' })}
                  className="input-field"
                  required
                >
                  <option value="team">Team</option>
                  <option value="leadership">Leadership</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={formData.linkedin_url || ''}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  className="input-field"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter URL
                </label>
                <input
                  type="url"
                  value={formData.twitter_url || ''}
                  onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                  className="input-field"
                  placeholder="https://twitter.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Image URL
                </label>
                <input
                  type="url"
                  value={formData.profile_image_url || ''}
                  onChange={(e) => setFormData({ ...formData, profile_image_url: e.target.value })}
                  className="input-field"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio *
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="input-field"
                rows={4}
                required
              />
            </div>

            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Featured</span>
              </label>
            </div>

            <div className="flex justify-end space-x-4">
              <button type="button" onClick={resetForm} className="btn-outline">
                Cancel
              </button>
              <button type="submit" className="btn-primary flex items-center">
                <Save className="w-5 h-5 mr-2" />
                {editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Leadership Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <Award className="w-6 h-6 mr-2 text-primary-600" />
          Leadership ({leadership.length})
        </h2>
        <div className="grid gap-4">
          {leadership.map((member, index) => (
            <div key={member.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {member.profile_image_url ? (
                    <img
                      src={member.profile_image_url}
                      alt={member.full_name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                      <span className="text-xl font-bold text-white">
                        {member.full_name.charAt(0)}
                      </span>
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <h3 className="text-lg font-bold text-gray-900">{member.full_name}</h3>
                      {member.is_featured && (
                        <Award className="w-5 h-5 ml-2 text-yellow-500" />
                      )}
                      {!member.is_active && (
                        <span className="ml-2 px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-primary-600 font-medium mb-2">{member.position}</p>
                    <p className="text-gray-700 text-sm line-clamp-2">{member.bio}</p>
                    
                    <div className="flex items-center space-x-2 mt-2">
                      {member.linkedin_url && <Linkedin className="w-4 h-4 text-gray-400" />}
                      {member.twitter_url && <Twitter className="w-4 h-4 text-gray-400" />}
                      {member.email && <Mail className="w-4 h-4 text-gray-400" />}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleReorder(member.id, 'up')}
                    disabled={index === 0}
                    className="p-2 text-gray-400 hover:text-primary-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <MoveUp className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleReorder(member.id, 'down')}
                    disabled={index === leadership.length - 1}
                    className="p-2 text-gray-400 hover:text-primary-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <MoveDown className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleEdit(member)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Team Members ({team.length})
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {team.map((member, index) => (
            <div key={member.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {member.profile_image_url ? (
                    <img
                      src={member.profile_image_url}
                      alt={member.full_name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center">
                      <span className="text-xl font-bold text-white">
                        {member.full_name.charAt(0)}
                      </span>
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <h3 className="text-lg font-bold text-gray-900">{member.full_name}</h3>
                      {!member.is_active && (
                        <span className="ml-2 px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-primary-600 font-medium mb-2">{member.position}</p>
                    <p className="text-gray-700 text-sm line-clamp-2">{member.bio}</p>
                    
                    <div className="flex items-center space-x-2 mt-2">
                      {member.linkedin_url && <Linkedin className="w-4 h-4 text-gray-400" />}
                      {member.twitter_url && <Twitter className="w-4 h-4 text-gray-400" />}
                      {member.email && <Mail className="w-4 h-4 text-gray-400" />}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleReorder(member.id, 'up')}
                    disabled={index === 0}
                    className="p-2 text-gray-400 hover:text-primary-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <MoveUp className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleReorder(member.id, 'down')}
                    disabled={index === team.length - 1}
                    className="p-2 text-gray-400 hover:text-primary-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <MoveDown className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleEdit(member)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

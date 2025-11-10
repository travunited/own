import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Linkedin, Twitter, Mail, Users, Award, Target } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getTeamMembers() {
  try {
    // Initialize Supabase client with environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase credentials not found');
      return { leadership: [], team: [] };
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { data: leadership } = await supabase
      .from('team_members')
      .select('*')
      .eq('department', 'leadership')
      .eq('is_active', true)
      .order('display_order');
    
    const { data: team } = await supabase
      .from('team_members')
      .select('*')
      .eq('department', 'team')
      .eq('is_active', true)
      .order('display_order');
    
    return { leadership: leadership || [], team: team || [] };
  } catch (error) {
    console.error('Error fetching team members:', error);
    return { leadership: [], team: [] };
  }
}

export default async function TeamPage() {
  const { leadership, team } = await getTeamMembers();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-purple-700 text-white py-20">
        <div className="container-custom text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <Users className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Meet Our Travunited Team
          </h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            The passionate professionals behind your seamless travel experience
          </p>
        </div>
      </section>

      {/* Leadership Section */}
      {leadership.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-4">
                <Award className="w-6 h-6 text-primary-600" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Leadership
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Visionary leaders driving innovation and excellence
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {leadership.map((member) => (
                <div
                  key={member.id}
                  className="card group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Profile Image */}
                  <div className="flex items-center mb-6">
                    <div className="relative">
                      {member.profile_image_url ? (
                        <img
                          src={member.profile_image_url}
                          alt={member.full_name}
                          className="w-24 h-24 rounded-full object-cover ring-4 ring-primary-100"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center ring-4 ring-primary-100">
                          <span className="text-3xl font-bold text-white">
                            {member.full_name.charAt(0)}
                          </span>
                        </div>
                      )}
                      {member.is_featured && (
                        <div className="absolute -top-1 -right-1 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                          <Award className="w-4 h-4 text-yellow-900" />
                        </div>
                      )}
                    </div>
                    <div className="ml-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {member.full_name}
                      </h3>
                      <p className="text-primary-600 font-semibold">
                        {member.position}
                      </p>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {member.bio}
                  </p>

                  {/* Social Links */}
                  {(member.linkedin_url || member.twitter_url || member.email) && (
                    <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                      {member.linkedin_url && (
                        <a
                          href={member.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-100 hover:bg-primary-100 text-gray-600 hover:text-primary-600 rounded-lg transition-colors"
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                      {member.twitter_url && (
                        <a
                          href={member.twitter_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-100 hover:bg-primary-100 text-gray-600 hover:text-primary-600 rounded-lg transition-colors"
                        >
                          <Twitter className="w-5 h-5" />
                        </a>
                      )}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="p-2 bg-gray-100 hover:bg-primary-100 text-gray-600 hover:text-primary-600 rounded-lg transition-colors"
                        >
                          <Mail className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team Section */}
      {team.length > 0 && (
        <section className="py-20">
          <div className="container-custom">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-4">
                <Target className="w-6 h-6 text-primary-600" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Team
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Dedicated professionals committed to your success
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member) => (
                <div
                  key={member.id}
                  className="card group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Profile Image */}
                  <div className="flex flex-col items-center mb-6">
                    {member.profile_image_url ? (
                      <img
                        src={member.profile_image_url}
                        alt={member.full_name}
                        className="w-32 h-32 rounded-full object-cover ring-4 ring-primary-100 mb-4"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center ring-4 ring-primary-100 mb-4">
                        <span className="text-4xl font-bold text-white">
                          {member.full_name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-gray-900 text-center mb-1">
                      {member.full_name}
                    </h3>
                    <p className="text-primary-600 font-semibold text-center">
                      {member.position}
                    </p>
                  </div>

                  {/* Bio */}
                  <p className="text-gray-700 text-sm leading-relaxed mb-6">
                    {member.bio}
                  </p>

                  {/* Social Links */}
                  {(member.linkedin_url || member.twitter_url || member.email) && (
                    <div className="flex items-center justify-center space-x-3 pt-4 border-t border-gray-200">
                      {member.linkedin_url && (
                        <a
                          href={member.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-100 hover:bg-primary-100 text-gray-600 hover:text-primary-600 rounded-lg transition-colors"
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                      {member.twitter_url && (
                        <a
                          href={member.twitter_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-100 hover:bg-primary-100 text-gray-600 hover:text-primary-600 rounded-lg transition-colors"
                        >
                          <Twitter className="w-5 h-5" />
                        </a>
                      )}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="p-2 bg-gray-100 hover:bg-primary-100 text-gray-600 hover:text-primary-600 rounded-lg transition-colors"
                        >
                          <Mail className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-purple-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Our team is here to make your travel dreams a reality
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/visas" className="btn-white">
              Apply for Visa
            </a>
            <a href="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600">
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}


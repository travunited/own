'use client';

import { Star, Calendar, Clock, CheckCircle, MapPin } from 'lucide-react';
import ShareButton from './ShareButton';

interface SuccessStoryCardProps {
  story: {
    id: string;
    userName: string;
    userPhoto?: string;
    userCity?: string;
    visaType: string;
    country: string;
    countryFlag: string;
    appliedDate: string;
    approvedDate: string;
    processingDays: number;
    rating: number;
    testimonial: string;
  };
}

export default function SuccessStoryCard({ story }: SuccessStoryCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white rounded-full -translate-y-24 translate-x-24"></div>
        </div>

        <div className="relative z-10">
          {/* Success Badge */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-lg">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h2 className="text-2xl font-bold mb-2">
            {story.countryFlag} {story.country} Visa Approved!
          </h2>
          <p className="text-green-100">From Application to Approval</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* User Info */}
        <div className="flex items-center mb-6">
          {story.userPhoto ? (
            <img
              src={story.userPhoto}
              alt={story.userName}
              className="w-16 h-16 rounded-full mr-4"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xl mr-4">
              {story.userName.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-bold text-lg text-gray-900">{story.userName}</p>
            {story.userCity && (
              <p className="text-sm text-gray-600 flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {story.userCity}
              </p>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-5 h-5 mr-2" />
              <span className="text-sm">Applied</span>
            </div>
            <span className="font-medium text-gray-900">
              {new Date(story.appliedDate).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div className="flex items-center text-gray-600">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="text-sm">Approved</span>
            </div>
            <span className="font-medium text-gray-900">
              {new Date(story.approvedDate).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center text-gray-600">
              <Clock className="w-5 h-5 mr-2" />
              <span className="text-sm">Processing Time</span>
            </div>
            <span className="font-bold text-green-600 text-lg">
              {story.processingDays} days
            </span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-4">
          <span className="text-sm font-medium text-gray-700 mr-2">Experience:</span>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < story.rating
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="ml-2 font-bold text-gray-900">{story.rating}.0</span>
        </div>

        {/* Testimonial */}
        <blockquote className="border-l-4 border-primary-600 pl-4 py-2 mb-6 bg-gray-50 rounded-r-lg">
          <p className="text-gray-700 italic">"{story.testimonial}"</p>
          <p className="text-sm text-gray-600 mt-2">- {story.userName}</p>
        </blockquote>

        {/* Call to Action */}
        <div className="bg-primary-50 rounded-lg p-4 mb-6">
          <p className="text-sm font-medium text-primary-900 mb-2">
            Get your {story.country} visa too!
          </p>
          <p className="text-xs text-primary-700">
            Fast processing, easy application, trusted by thousands
          </p>
        </div>

        {/* Share Button */}
        <ShareButton
          title={`${story.userName}'s ${story.country} Visa Success Story`}
          description={`Applied: ${new Date(story.appliedDate).toLocaleDateString('en-IN')} | Approved: ${new Date(story.approvedDate).toLocaleDateString('en-IN')} | Just ${story.processingDays} days! "${story.testimonial}" - ${story.userName}`}
          url={`https://travunited.com/visas/${story.country.toLowerCase()}`}
          hashtags={['Travunited', `${story.country}Visa`, 'VisaSuccess']}
          variant="primary"
          className="w-full"
        />
      </div>

      {/* Footer Branding */}
      <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-200">
        <p className="text-sm text-gray-600">
          <strong className="text-primary-600">Travunited</strong> • Making travel
          accessible for everyone
        </p>
      </div>
    </div>
  );
}


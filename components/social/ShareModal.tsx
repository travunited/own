'use client';

import { useState } from 'react';
import { X, Facebook, Twitter, Linkedin, Mail, Link2, MessageCircle, Check, Copy } from 'lucide-react';
import { trackShareEvent } from '@/lib/analytics/social';

interface ShareModalProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  hashtags?: string[];
  referralCode?: string;
  onClose: () => void;
}

interface SharePlatform {
  name: string;
  icon: any;
  color: string;
  getShareUrl: (title: string, url: string, hashtags: string[]) => string;
}

export default function ShareModal({
  title,
  description,
  url,
  image,
  hashtags = [],
  referralCode,
  onClose,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [personalMessage, setPersonalMessage] = useState('');

  // Add referral code to URL if provided
  const shareUrl = referralCode ? `${url}?ref=${referralCode}` : url;
  const fullUrl = shareUrl.startsWith('http') ? shareUrl : `https://travunited.com${shareUrl}`;

  const platforms: SharePlatform[] = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: '#1877F2',
      getShareUrl: (title, url) =>
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: '#1DA1F2',
      getShareUrl: (title, url, hashtags) =>
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(
          title
        )}&hashtags=${hashtags.join(',')}&via=Travunited`,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: '#0A66C2',
      getShareUrl: (title, url) =>
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: '#25D366',
      getShareUrl: (title, url) =>
        `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    },
    {
      name: 'Email',
      icon: Mail,
      color: '#EA4335',
      getShareUrl: (title, url) =>
        `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(
          `${description}\n\n${url}`
        )}`,
    },
  ];

  const handleShare = (platform: SharePlatform) => {
    const shareLink = platform.getShareUrl(
      personalMessage || title,
      fullUrl,
      hashtags
    );

    // Track share event
    trackShareEvent({
      platform: platform.name.toLowerCase(),
      contentType: 'generic',
      url: shareUrl,
      referralCode,
    });

    // Open share link
    window.open(shareLink, '_blank', 'width=600,height=400');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      
      // Track copy event
      trackShareEvent({
        platform: 'copy_link',
        contentType: 'generic',
        url: shareUrl,
        referralCode,
      });

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Share with friends</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Preview */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
            <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
          </div>

          {/* Personal Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add a personal message (optional)
            </label>
            <textarea
              value={personalMessage}
              onChange={(e) => setPersonalMessage(e.target.value)}
              className="input-field resize-none"
              rows={3}
              placeholder="Add your thoughts..."
            />
          </div>

          {/* Referral Code */}
          {referralCode && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-900">
                    Your Referral Code
                  </p>
                  <p className="text-lg font-bold text-green-700 mt-1">
                    {referralCode}
                  </p>
                </div>
                <div className="text-green-600">
                  <Check className="w-6 h-6" />
                </div>
              </div>
              <p className="text-xs text-green-700 mt-2">
                Friends get ₹500 discount, you get ₹500 credit!
              </p>
            </div>
          )}

          {/* Social Platforms */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">
              Share on social media
            </p>
            <div className="grid grid-cols-5 gap-3">
              {platforms.map((platform) => (
                <button
                  key={platform.name}
                  onClick={() => handleShare(platform)}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  title={`Share on ${platform.name}`}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: platform.color }}
                  >
                    <platform.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs text-gray-600">{platform.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Copy Link */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Or copy link</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={fullUrl}
                readOnly
                className="input-field flex-1 text-sm"
              />
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  copied
                    ? 'bg-green-600 text-white'
                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-600 text-center">
            Help us grow by sharing Travunited with your friends! 🌟
          </p>
        </div>
      </div>
    </div>
  );
}


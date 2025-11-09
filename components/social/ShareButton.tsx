'use client';

import { useState } from 'react';
import { Share2, Facebook, Twitter, Linkedin, Mail, Link2, MessageCircle } from 'lucide-react';
import ShareModal from './ShareModal';

interface ShareButtonProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  hashtags?: string[];
  variant?: 'primary' | 'secondary' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ShareButton({
  title,
  description,
  url,
  image,
  hashtags = [],
  variant = 'primary',
  size = 'md',
  className = '',
}: ShareButtonProps) {
  const [showModal, setShowModal] = useState(false);

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-outline',
    icon: 'p-2 hover:bg-gray-100 rounded-full transition-colors',
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`
          ${variantClasses[variant]} 
          ${variant !== 'icon' ? sizeClasses[size] : ''} 
          flex items-center gap-2 
          ${className}
        `}
        aria-label="Share content"
      >
        <Share2 className={variant === 'icon' ? 'w-5 h-5' : 'w-4 h-4'} />
        {variant !== 'icon' && <span>Share</span>}
      </button>

      {showModal && (
        <ShareModal
          title={title}
          description={description}
          url={url}
          image={image}
          hashtags={hashtags}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}


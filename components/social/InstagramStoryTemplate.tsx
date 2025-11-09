'use client';

import { Download } from 'lucide-react';

interface InstagramStoryTemplateProps {
  type: 'visa' | 'tour' | 'achievement';
  data: {
    title: string;
    subtitle?: string;
    mainText: string;
    stats?: Array<{ label: string; value: string }>;
    userPhoto?: string;
    backgroundImage?: string;
    backgroundColor?: string;
  };
}

export default function InstagramStoryTemplate({
  type,
  data,
}: InstagramStoryTemplateProps) {
  const downloadStory = () => {
    // TODO: Implement canvas-based story generation
    alert('Download feature coming soon!');
  };

  // Instagram Story dimensions: 1080 x 1920 (9:16 aspect ratio)
  const storyStyles = {
    visa: 'from-green-500 to-emerald-600',
    tour: 'from-blue-500 to-cyan-600',
    achievement: 'from-purple-500 to-pink-600',
  };

  return (
    <div className="space-y-4">
      {/* Preview */}
      <div className="bg-gray-100 rounded-lg p-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Instagram Story Preview (9:16)</p>
        
        {/* Story Canvas */}
        <div
          className="mx-auto rounded-xl shadow-2xl overflow-hidden relative"
          style={{
            width: '270px',
            height: '480px',
            background: data.backgroundColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          {/* Background Image */}
          {data.backgroundImage && (
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `url(${data.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          )}

          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${storyStyles[type]} opacity-90`} />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-between p-6 text-white">
            {/* Top */}
            <div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 inline-block mb-4">
                <p className="text-xs font-semibold uppercase">Travunited</p>
              </div>
            </div>

            {/* Middle */}
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2 drop-shadow-lg">
                {data.title}
              </h1>
              {data.subtitle && (
                <p className="text-lg font-medium mb-4 drop-shadow-lg">
                  {data.subtitle}
                </p>
              )}
              <p className="text-xl font-semibold mb-6 drop-shadow-lg">
                {data.mainText}
              </p>

              {/* Stats */}
              {data.stats && data.stats.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {data.stats.map((stat, idx) => (
                    <div key={idx} className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom */}
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-block mb-2">
                <p className="text-sm font-semibold">Swipe Up</p>
              </div>
              <p className="text-xs opacity-80">Get your visa too →</p>
            </div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={downloadStory}
        className="btn-primary w-full flex items-center justify-center"
      >
        <Download className="w-5 h-5 mr-2" />
        Download for Instagram Stories
      </button>

      <p className="text-xs text-gray-600 text-center">
        1080x1920px • Perfect for Instagram Stories • Ready to share
      </p>
    </div>
  );
}


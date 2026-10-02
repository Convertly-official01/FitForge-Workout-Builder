import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Download } from 'lucide-react';
import { WorkoutPlan } from '../types';
import { generateShareUrl } from '../utils/share';

interface ShareModalProps {
  plan: WorkoutPlan;
  onClose: () => void;
}

export default function ShareModal({ plan, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = generateShareUrl(plan);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(plan, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${plan.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalExercises = plan.days.reduce((acc, d) => acc + d.exercises.length, 0);
  const activeDays = plan.days.filter(d => !d.isRestDay && d.exercises.length > 0).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X size={18} />
          </button>
          <h2 className="text-xl font-bold mb-1">Share Your Program</h2>
          <p className="text-sm text-white/80">{plan.name}</p>
          <div className="flex gap-4 mt-3 text-xs text-white/70">
            <span>📅 {activeDays} active days</span>
            <span>🏋️ {totalExercises} exercises</span>
            <span>📊 {plan.level}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Share Link */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Shareable Link</label>
            <div className="flex gap-2">
              <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2.5 text-xs text-gray-600 truncate border border-gray-200">
                {shareUrl.length > 50 ? shareUrl.substring(0, 50) + '...' : shareUrl}
              </div>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-indigo-500 text-white hover:bg-indigo-600'
                }`}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Open in new tab */}
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 w-full p-3 rounded-xl border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-200">
              <ExternalLink size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Open Shared View</p>
              <p className="text-xs text-gray-500">View your program as a shareable page</p>
            </div>
          </a>

          {/* Export JSON */}
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-3 w-full p-3 rounded-xl border border-gray-200 hover:border-green-200 hover:bg-green-50/50 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 group-hover:bg-green-200">
              <Download size={18} />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">Export as JSON</p>
              <p className="text-xs text-gray-500">Download program data for backup</p>
            </div>
          </button>

          {/* Share on social */}
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center mb-3">Or share directly</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  const text = `Check out my workout program: ${plan.name}! ${shareUrl}`;
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
                }}
                className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <span className="text-lg">𝕏</span>
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: plan.name,
                      text: `Check out my workout program: ${plan.name}`,
                      url: shareUrl,
                    });
                  }
                }}
                className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <span className="text-lg">📤</span>
              </button>
              <button
                onClick={() => {
                  const text = `Check out my workout program: ${plan.name}! ${shareUrl}`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                }}
                className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <span className="text-lg">💬</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

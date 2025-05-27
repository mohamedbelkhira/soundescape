'use client'
import { Button } from '@/components/ui/button'
import { Share2 } from 'lucide-react'
import { useState, useEffect } from 'react';

interface ShareAudiobookButtonProps {
  title: string
  authorName: string
}

export const ShareAudiobookButton = ({ title, authorName }: ShareAudiobookButtonProps) => {
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (feedbackMessage) {
      timer = setTimeout(() => {
        setFeedbackMessage(null);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [feedbackMessage]);

  const handleShare = async () => {
    setFeedbackMessage(null); // Reset previous message
    const shareData = {
      title: title,
      text: `Check out "${title}" by ${authorName}. Listen here: ${window.location.href}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        // No feedback needed here as native share UI handles it
      } catch (error) {
        // AbortError means user cancelled share. Other errors are actual errors.
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Share API error:', error);
          setFeedbackMessage('Could not share.');
        }
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        setFeedbackMessage('Link copied to clipboard!');
      } catch (error) {
        console.error('Failed to copy link:', error);
        setFeedbackMessage('Failed to copy link.');
      }
    }
  };

  return (
    <div className="w-full">
      <Button
        variant="outline"
        onClick={handleShare}
        className="w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-white/90 dark:hover:bg-slate-700/90"
      >
        <Share2 className="h-4 w-4 mr-2" />
        Share Audiobook
      </Button>
      {feedbackMessage && (
        <p className="text-xs text-center text-slate-600 dark:text-slate-400 mt-2 transition-opacity duration-300 ease-in-out">
          {feedbackMessage}
        </p>
      )}
    </div>
  );
};
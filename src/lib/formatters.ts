export const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) return '0:00';
    const s = Math.floor(seconds); // Work with integer seconds
  
    const hours = Math.floor(s / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const secs = Math.floor(s % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
  
  export const formatDuration = (seconds: number | null): string => {
    if (seconds === null || seconds === undefined || isNaN(seconds) || !isFinite(seconds) || seconds < 0) return 'Unknown';
    if (seconds === 0) return '0m';
  
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    // Show minutes if there are any, or if there are no hours (e.g., for durations less than 1 hour)
    if (minutes > 0 || hours === 0) parts.push(`${minutes}m`);
    
    return parts.length > 0 ? parts.join(' ') : '0m'; // Default to 0m if somehow both are zero (should be caught by seconds === 0)
  }
  
  export const formatDistanceToNow = (dateInput: string | Date): string => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return 'Invalid date';
  
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    
    const seconds = Math.floor(diffInMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30.4375); // Average days in month
    const years = Math.floor(days / 365.25); // Average days in year, accounting for leap years
  
    if (Math.abs(seconds) < 5) return 'just now'; // For very recent or slightly future times
    if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
    if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (seconds > 0) return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    
    // Handle future dates slightly
    if (seconds < 0) return `in ${Math.abs(seconds)} second${Math.abs(seconds) !== 1 ? 's' : ''}`;
  
    return 'some time ago'; // Fallback
  }
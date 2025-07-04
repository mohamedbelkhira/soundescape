export const formatAudioUrl = (url: string | null): string => {
    if (!url) return ''
    
    // If it's already a full URL or an API path, return as is
    if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('/api/')) {
      return url
    }
    
    // Clean up potential leading slashes or 'uploads/' prefix from a relative path
    const cleanPath = url.replace(/^\/+/, '').replace(/^uploads\//, '')
    // Ensure this matches your backend route for serving files
    return `/api/files/${cleanPath}`
  }


  export const formatAudioUrl2 = (filename: string) => {
    //function to remove names ("api/files/audio") AND PRINT THE FILENAME 
    const cleanFilename = filename.replace(/^\/api\/files\/audio\//, '');
    console.log(cleanFilename);
    
    return  `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/api/audiobooks/${cleanFilename.replace(/\.mp3$/, '')}/stream`
  }
  
  
  export const formatCoverUrl = (url: string | null): string => {
    if (!url) return ''
    
    if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('/api/')) {
      return url
    }
    
    const cleanPath = url.replace(/^\/+/, '').replace(/^uploads\//, '')
    return `/api/files/${cleanPath}`
  }
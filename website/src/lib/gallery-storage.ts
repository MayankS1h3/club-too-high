import { supabase } from './supabase'

// Get all images directly from storage bucket
export async function getGalleryImagesFromStorage() {
  try {
    console.log('Fetching from gallery-images bucket...')
    
    // First, let's try to list all buckets to see what's available
    try {
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
      console.log('Available buckets:', buckets)
    } catch (bucketsErr) {
      console.log('Could not list buckets:', bucketsErr)
    }

    // Try the main bucket name
    const { data, error } = await supabase.storage
      .from('gallery-images')
      .list('', {
        limit: 100,
        offset: 0
      })

    console.log('Storage response - data:', data, 'error:', error)

    if (error) {
      console.error('Storage error:', error)
      // Try alternative bucket name
      console.log('Trying alternative bucket name...')
      const { data: altData, error: altError } = await supabase.storage
        .from('gallery_images')
        .list('', { limit: 100, offset: 0 })
      
      console.log('Alternative bucket response - data:', altData, 'error:', altError)
      
      if (altError) {
        console.log('Both bucket names failed, using fallback images')
        return getFallbackImages()
      }
      
      // Use alternative data if it worked
      if (altData && altData.length > 0) {
        console.log('Alternative bucket worked!')
        return processStorageFiles(altData, 'gallery_images')
      }
    }

    if (data && data.length > 0) {
      console.log('Main bucket worked!')
      return processStorageFiles(data, 'gallery-images')
    }
    
    console.log('No valid files found in storage, using fallback images')
    return getFallbackImages()
    
  } catch (error) {
    console.error('Error in getGalleryImagesFromStorage:', error)
    return getFallbackImages()
  }
}

function processStorageFiles(data: any[], bucketName: string) {
  console.log('Processing files from bucket:', bucketName)
  
  const validFiles = data.filter(file => {
    console.log('Checking file:', file)
    const isValid = file.name && 
                   !file.name.includes('.emptyFolderPlaceholder') &&
                   file.name !== '.emptyFolderPlaceholder'
    console.log(`File ${file.name} is valid:`, isValid)
    return isValid
  })

  console.log('Valid files found:', validFiles)

  if (validFiles.length > 0) {
    const images = validFiles.map(file => {
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(file.name)
      
      console.log('Generated URL for', file.name, ':', publicUrl)
      
      return {
        id: file.name,
        image_url: publicUrl,
        caption: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' '),
        created_at: file.created_at || new Date().toISOString()
      }
    })

    console.log('Final images array from storage:', images)
    return images
  }
  
  return getFallbackImages()
}

function getFallbackImages() {
  // Your actual uploaded images (hardcoded URLs)
  const yourImages = [
    {
      id: 'brave_screenshot',
      image_url: 'https://edljytecigknkoxtfmyl.supabase.co/storage/v1/object/public/gallery-images/brave_screenshot_localhost%3A3000.png',
      caption: 'Brave screenshot localhost',
      created_at: new Date().toISOString()
    },
    {
      id: 'recruit_schools',
      image_url: 'https://edljytecigknkoxtfmyl.supabase.co/storage/v1/object/public/gallery-images/recruit%20schools.png',
      caption: 'Recruit schools',
      created_at: new Date().toISOString()
    },
    {
      id: 'use_case',
      image_url: 'https://edljytecigknkoxtfmyl.supabase.co/storage/v1/object/public/gallery-images/use-case.png',
      caption: 'Use case',
      created_at: new Date().toISOString()
    }
  ]

  // Fallback sample images if your images don't load
  const sampleImages = [
    {
      id: 'sample1',
      image_url: 'https://images.unsplash.com/photo-1571266028243-d220c9d3b104?w=800',
      caption: 'Electric night atmosphere',
      created_at: new Date().toISOString()
    },
    {
      id: 'sample2', 
      image_url: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=800',
      caption: 'VIP section vibes',
      created_at: new Date().toISOString()
    },
    {
      id: 'sample3',
      image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800', 
      caption: 'Dance floor energy',
      created_at: new Date().toISOString()
    },
    {
      id: 'sample4',
      image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
      caption: 'Premium cocktails',
      created_at: new Date().toISOString()
    }
  ]

  // Return your actual images first, then fallback samples
  return [...yourImages, ...sampleImages]
}
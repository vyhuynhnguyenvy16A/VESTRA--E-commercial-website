import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';

function ProductGallery({ images = [] }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Lọc ảnh trùng
  const uniqueImages = images.filter((img, index, self) =>
    index === self.findIndex((t) => t.url === img.url)
  );

  const displayImages = uniqueImages.length > 0 ? uniqueImages : [
    { id: 'fallback', url: 'https://via.placeholder.com/500x500?text=No+Image' }
  ];

  useEffect(() => { setSelectedImageIndex(0); }, [images]);

  const showThumbnails = displayImages.length > 1;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start' }}>
      
      {/* --- ẢNH LỚN --- */}
      <Box
        sx={{
          width: '500px',
          aspectRatio: '1 / 1',  

          bgcolor: '#fff',   
          borderRadius: '12px', 
          border: '1px solid #f0f0f0', 

          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          src={displayImages[selectedImageIndex]?.url || displayImages[0]?.url}
          alt="Product Main"
          onError={(e) => { 
            e.target.onerror = null; 
            e.target.src = 'https://via.placeholder.com/500x500?text=No+Image'; 
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain', 
            display: 'block'
          }}
        />
      </Box>

      {/* --- THUMBNAILS --- */}
      {showThumbnails && (
        <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 1, maxWidth: '100%' }}>
          {displayImages.map((image, idx) => (
            <Box
              key={idx}
              onClick={() => setSelectedImageIndex(idx)}
              sx={{
                width: 70,
                height: 70,
                bgcolor: '#fff',
                borderRadius: '8px',
                cursor: 'pointer',
                border: selectedImageIndex === idx ? '2px solid #000' : '1px solid #eee',
                overflow: 'hidden',
                flexShrink: 0,
                transition: 'all 0.2s',
                opacity: selectedImageIndex === idx ? 1 : 0.7
              }}
            >
              <img
                src={image.url}
                alt={`Thumbnail ${idx}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default ProductGallery;
// Utility function to get image URL from base64 data
function getImageUrl(base64String) {
    return base64String 
        ? `data:image/jpeg;base64,${base64String}`
        : 'https://via.placeholder.com/300x200?text=No+Image';
}

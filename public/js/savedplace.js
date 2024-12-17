function toggleLike(placeId) {
    const likeButton = document.querySelector(`[data-place-id="${placeId}"]`);
    let isLiked = likeButton.textContent.trim() === "Liked";

  
    likeButton.textContent = isLiked ? "Like" : "Liked";
  
    fetch('/places/toggleLike', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        placeId: placeId,
        liked: !isLiked, 
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (!data.success) {
        alert('Error saving like status');
      }
    });
  }
document.addEventListener('DOMContentLoaded', () => {
    const userIdElement = document.getElementById('userId');
    const userId = userIdElement ? userIdElement.value.trim() : null;
  
    if (!userId) {
      console.error('User ID is not available or invalid.');
      alert('User ID is missing. Please log in again.');
      return;
    }
  
    const reviewModal = document.getElementById('reviewModal');
    const modalYes = document.getElementById('modalYes');
    const modalClose = document.getElementById('modalClose');
  
    const question1 = document.getElementById('question1');
    const question2 = document.getElementById('question2');
    const question3 = document.getElementById('question3');
    const reviewTitle = document.getElementById('reviewTitle');
  
    const visitedYes = document.getElementById('visitedYes');
    const visitedNo = document.getElementById('visitedNo');
    const question2Next = document.getElementById('question2Next');
    const question3Next = document.getElementById('question3Next');
  
    let reviewData = {};
  
    reviewModal.style.display = 'block';
  
    modalYes.addEventListener('click', () => {
      reviewModal.style.display = 'none';
      reviewTitle.style.display = 'block';
      question1.style.display = 'block';
    });
  
    const closeModal = () => {
      reviewModal.style.display = 'none';
      window.location.href = '/moods/moodpage';
    };
  
    modalClose.addEventListener('click', closeModal);
  
    visitedYes.addEventListener('click', () => {
      question2.style.display = 'block';
    });
  
    visitedNo.addEventListener('click', () => {
      alert('Redirecting to mood page.');
      window.location.href = '/moods/moodpage';
    });
  
    question2Next.addEventListener('click', () => {
      const selectedPlaceElement = document.getElementById('placeId');
      const selectedPlace = selectedPlaceElement ? selectedPlaceElement.value.trim() : null;
  
      if (!selectedPlace) {
        alert('Please select a valid place.');
        return;
      }
  
      reviewData.placeId = selectedPlace;
      question3.style.display = 'block';
    });
  
    question3Next.addEventListener('click', () => {
      const ratingElement = document.getElementById('rating');
      const rating = ratingElement ? ratingElement.value.trim() : null;
  
      if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
        alert('Please provide a valid rating between 1 and 5.');
        return;
      }
  
      reviewData.rating = Number(rating);
      submitReview(reviewData);
    });
  
    async function submitReview(data) {
      data.userId = userId;
  
      console.log('Submitting review data:', data);
  
      try {
        const response = await fetch('/reviews/review', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Failed to submit review: ${errorMessage}`);
        }
  
        alert('Review submitted successfully!');
        window.location.href = '/moods/moodpage';
      } catch (error) {
        console.error(error);
        alert(`Error: ${error.message}`);
      }
    }
  });
  
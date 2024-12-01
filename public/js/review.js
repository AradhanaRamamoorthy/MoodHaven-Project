document.addEventListener('DOMContentLoaded', () => {
  const userIdElement = document.getElementById('userId');
  const userId = userIdElement ? userIdElement.value : null;

  if (!userId) {
    console.error('User ID is not available.');
    return;
  }

  const question1 = document.getElementById('question1');
  const question2 = document.getElementById('question2');
  const question3 = document.getElementById('question3');
  const question4 = document.getElementById('question4');
  const visitedYes = document.getElementById('visitedYes');
  const visitedNo = document.getElementById('visitedNo');
  const question2Next = document.getElementById('question2Next');
  const question3Next = document.getElementById('question3Next');
  const savePlaceYes = document.getElementById('savePlaceYes');
  const savePlaceNo = document.getElementById('savePlaceNo');

  let reviewData = {};

  // Question 1
  visitedYes.addEventListener('click', () => {
    question2.style.display = 'block'; 
  });

  visitedNo.addEventListener('click', () => {
    alert('Redirecting to mood page.');
    window.location.href = '/moodpage';
  });

  // Question 2
  question2Next.addEventListener('click', () => {
    const selectedPlace = document.getElementById('placeId').value;
    if (!selectedPlace) {
      alert('Please select a place.');
      return;
    }
    reviewData.placeId = selectedPlace;
    question3.style.display = 'block'; 
  });

  // Question 3
  question3Next.addEventListener('click', () => {
    const rating = document.getElementById('rating').value;
    if (rating < 1 || rating > 5 || !rating) {
      alert('Please provide a rating between 1 and 5.');
      return;
    }
    reviewData.rating = Number(rating);  
    question4.style.display = 'block'; 
  });

  // Question 4
  savePlaceYes.addEventListener('click', async () => {
    reviewData.savePlace = true;
    await submitReview(reviewData);
  });

  savePlaceNo.addEventListener('click', async () => {
    reviewData.savePlace = false;
    await submitReview(reviewData);
  });

  async function submitReview(data) {
    data.userId = userId;

    console.log('Submitting review data:', data);
    const response = await fetch('/review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to submit review');
    }

    alert('Review submitted!');
    window.location.href = '/moodpage';  
  }
});

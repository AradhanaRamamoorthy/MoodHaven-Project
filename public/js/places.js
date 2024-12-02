const location_access = document.getElementById("nextPageBtn");
const selectedActivityInput = document.getElementById('selectedActivityInput');

location_access.addEventListener('click', (event) => {
  event.preventDefault();
  const selectedActivity = selectedActivityInput.value;
  if (!selectedActivity) {
    alert('Please select an activity before proceeding.');
    return;
  }
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const response = await fetch('/location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude, longitude, activity: selectedActivity }),
      });
      
      if (response.ok) {
        window.location.href = `/places/placepage/${encodeURIComponent(selectedActivity)}`;
      } else {
        alert('Failed to fetch places. Please try again.');
      }
    });
  } else {
    alert('Geolocation is not supported by this browser.');
  }
});

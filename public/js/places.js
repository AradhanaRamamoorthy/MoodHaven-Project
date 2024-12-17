const location_access = document.getElementById("nextPageBtn");
if(location_access)
{
const selectedActivityInput = document.getElementById('selectedActivityInput');
const errorContainer = document.getElementById('error-container');
const errorMessage = errorContainer.getElementsByClassName('text-goes-here')[0];
errorContainer.classList.add('hidden');
location_access.addEventListener("click", (event) => {
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
      if(!latitude || !longitude){
        res.status(400).json({ error: 'Invalid location data.' });
      }
      try {
      const response = await fetch('/places/location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude, longitude, activity: selectedActivity }),
      });
      
      if (response.ok) {
        const hiddenForm = document.createElement('form');
        hiddenForm.action = `/places/placepage/${encodeURIComponent(selectedActivity)}`;
        hiddenForm.method = 'GET';
        document.body.appendChild(hiddenForm);
        hiddenForm.submit();
      } else {
        errorMessage.textContent = "Failed to fetch the places for the activity selected!";
        errorContainer.classList.remove('hidden'); 
      }
     }
    catch(e)
    {
      errorMessage.textContent = "Unable to connect to the server. Please try again!";
      errorContainer.classList.remove('hidden');
    }
    });
  } else {
    errorMessage.textContent = "Geolocation is not supported by this browser.";
    errorContainer.classList.remove('hidden');
  }
});
}
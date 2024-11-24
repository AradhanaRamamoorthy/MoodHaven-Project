document.addEventListener("DOMContentLoaded", function() {
    const interestSelect = document.getElementById("interestselect");
    const activitiesContainer = document.getElementById("activities-container");
    const activitiesList = document.getElementById("activities-list");
    const errorContainer = document.getElementById("error-container");
    const errorMessage = errorContainer.querySelector(".alert");
    const getActivitiesBtn = document.getElementById("getActivitiesBtn");
    const nextPageBtn = document.getElementById("nextPageBtn");


    let selectedInterest = "";
    interestSelect.addEventListener("change", function() {
        selectedInterest = this.value;
    });
    getActivitiesBtn.addEventListener("click", function() {
        if (selectedInterest) {
          fetchActivities(selectedInterest); 
        } else {
          showError("Please select an interest before submitting.");
        }
    });

    function fetchActivities(interest) {
        activitiesContainer.classList.add("hidden");
        errorContainer.classList.add("hidden");
        fetch(`/interests/${interest}/activities`) 
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                return response.json(); 
            })
            .then(data => {

                if (data && data.length > 0) {
                    displayActivities(data); 
                } else {
                    showError("No activities found for this interest."); 
                }
            })
            .catch(error => {
                console.error("Error fetching activities:", error);
                showError("An error occurred while fetching activities.");
            });
    }
    function displayActivities(activities) {
        activitiesList.innerHTML = ""; 
        activities.forEach(activity => {
            const listItem = document.createElement("li");
            listItem.textContent = activity;
            activitiesList.appendChild(listItem);
        });
        activitiesContainer.classList.remove("hidden");
    }
    function showError(message) {
        errorMessage.textContent = message;
        errorContainer.classList.remove("hidden"); 
    }
    nextPageBtn.addEventListener("click", function() {
        window.location.href = "/interests/placepage";  // Redirect to the next page
    });
});

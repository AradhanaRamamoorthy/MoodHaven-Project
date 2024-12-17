document.addEventListener("DOMContentLoaded", function() {
    const interestSelect = document.getElementById("interestselect");
    const activitiesContainer = document.getElementById("activities-container");
    const activitySelect = document.getElementById("activityselect");
    const errorContainer = document.getElementById("error-container");
    const errorMessage = errorContainer.querySelector(".alert");
    const getActivitiesBtn = document.getElementById("getActivitiesBtn");
    const activityForm = document.getElementById("activityForm");
    const selectedActivityInput = document.getElementById("selectedActivityInput");

    let selectedInterest = "";

    interestSelect.addEventListener("change", function() {
        selectedInterest = this.value;
        activitySelect.innerHTML = `<option value="" disabled selected>Choose an activity</option>`;
        activitiesContainer.classList.add("hidden");
    });

    getActivitiesBtn.addEventListener("click", function() {
        if (selectedInterest) {
            fetchActivities(selectedInterest);
        } else {
            clearSelectedInterest();
        }
    });

    function fetchActivities(interest) {
        activitiesContainer.classList.add("hidden");
        errorContainer.classList.add("hidden");
        activitySelect.innerHTML = `<option value="" disabled selected>Choose an activity</option>`;
        fetch(`/interests/${interest}/activities`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                if (data && data.length > 0) {
                    populateActivities(data);
                } else {
                    showError("No activities found for this interest.");
                }
            })
            .catch(error => {
                console.error("Error fetching activities:", error);
                showError("An error occurred while fetching activities.");
            });
    }

    function populateActivities(activities) {
        activities.forEach(activity => {
            const option = document.createElement("option");
            option.value = activity;
            option.textContent = activity;
            activitySelect.appendChild(option);
        });
        activitiesContainer.classList.remove("hidden");
        nextPageBtn.classList.remove("hidden");
        activityForm.classList.remove("hidden");
    }
    function clearSelectedInterest() {
        interestSelect.selectedIndex = 0; 
        selectedInterest = "";  
        activitySelect.innerHTML = `<option value="" disabled selected>Choose an activity</option>`;
        activitiesContainer.classList.add("hidden");
        errorContainer.classList.add("hidden"); 
    }
    activitySelect.addEventListener("change", function () {
        const selectedActivity = this.value;
        if (selectedActivity) {
            selectedActivityInput.value = selectedActivity;  
        }
    });

    function showError(message) {
        errorMessage.textContent = message || "An unexpected error occurred.";
        errorContainer.classList.remove("hidden");
    }
});

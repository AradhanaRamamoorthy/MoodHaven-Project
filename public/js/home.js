const homeForm = document.getElementById('homeForm');

if(homeForm){
    const userBio = document.getElementsByName('bio');
    const userInterests = document.getElementsByName('interests');
    const interestsDropdown = document.getElementById("interests-dropdown");
    const errorContainer = document.getElementById("error-container");
    const errorMessage = errorContainer.getElementsByClassName('text-goes-here');

    errorContainer.classList.add('hidden');
    
    homeForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 

        const selectedInterests = Array.from(interestsDropdown.selectedOptions).map(option => option.value);

        if (selectedInterests.length < 1 || selectedInterests.length > 4) {
            event.preventDefault(); 
            errorContainer.classList.remove("hidden"); 
            errorMessage.textContent = "Please select between 1 and 4 interests.";
        } else {
            errorContainer.classList.add("hidden"); 
            errorMessage.textContent = "";
        }
        
        
    })
}

  
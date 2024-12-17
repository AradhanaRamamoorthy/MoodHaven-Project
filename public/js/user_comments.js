document.addEventListener("DOMContentLoaded", () => {
    let place_ids = document.querySelectorAll(".place-id");
    let comment_form = document.querySelectorAll(".comment_Form");
    const errorContainer = document.getElementById('error-container');
    const errorMessage = errorContainer.querySelector('.text-goes-here');
    errorContainer.classList.add('hidden');

    function display_Comments(display_Info) {
    try
    {
        const comments = display_Info.querySelectorAll('.comment_display_info');
        const view_More_comment = display_Info.querySelector('.view_More_comments');

        if (view_More_comment) {
            view_More_comment.remove();
        }

        if (comments.length > 3) {
            let expanded_comments_display = document.createElement("button");
            expanded_comments_display.textContent = "View More";
            expanded_comments_display.classList.add("view_More_comments");
            display_Info.appendChild(expanded_comments_display);

            comments.forEach((comment, index) => {
                if (index > 2) {
                    comment.classList.add("hidden");
                }
            });

            expanded_comments_display.addEventListener("click", () => {
            try{
                const isViewLess = expanded_comments_display.classList.contains("view_less");

                if (isViewLess) {
                    comments.forEach((comment, index) => {
                        if (index > 2) {
                            comment.classList.add("hidden");
                        }
                    });
                    expanded_comments_display.textContent = "View More";
                    expanded_comments_display.classList.remove("view_less");
                } else {
                    comments.forEach((comment) => comment.classList.remove("hidden"));
                    expanded_comments_display.textContent = "View Less";
                    expanded_comments_display.classList.add("view_less");
                }
            }
            catch(e)
            {
                alert("There is an issue in toggling the comment! Please try again!");
            }
            });
        }
    }
    catch(e)
        {
            alert("Error in fetching the comments!");
        }
    }

    document.querySelectorAll('.comments-details').forEach(comment_data => {
        display_Comments(comment_data);
    });

    comment_form.forEach((commentForm) => {
        commentForm.addEventListener('submit', async(event) => {
            event.preventDefault();
            let place_Id = commentForm.getAttribute("data-place-id");
            let comment_Text = document.getElementById(`commentText-${place_Id}`).value;
            comment_Text = comment_Text.trim();
            
            if (!comment_Text || typeof comment_Text !== 'string' || comment_Text.length === 0) {
                alert("Comments cannot be empty value");
                return;
            }

            let userNameElement = commentForm.querySelector(".userName");
            let userName = userNameElement.textContent.trim();
            let userProfileElement = commentForm.querySelector(".user-profile-pic");
            let userProfilePic = userProfileElement ? userProfileElement.src : null;

            try {
                const response = await fetch(`/places/placepage/${place_Id}/comments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ comment_Text: comment_Text, user_name: userName, user_profilePic: userProfilePic })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    errorMessage.textContent = errorData.error || 'An error occurred. Please try again.';
                    errorContainer.classList.remove('hidden');
                }

                let comments_updated = await response.json();
                let comments_part = document.getElementById(`comments_list_${place_Id}`);
                comments_part.innerHTML = "";

                comments_updated.forEach((comment) => {
                    let comment_display_Info = document.createElement("div");
                    comment_display_Info.classList.add("comment_display_info");

                    let user_details = document.createElement("div");
                    user_details.classList.add("user-details");

                    let user_profile_pic = document.createElement("img");
                    user_profile_pic.src = comment.user_profilePic; 
                    user_profile_pic.alt = `${comment.userName}'s profile picture`;
                    user_profile_pic.classList.add("user-profile-pic");
                    user_details.appendChild(user_profile_pic);

                    let userName_commented = document.createElement("p");
                    userName_commented.classList.add('userName');
                    userName_commented.innerHTML = `${comment.userName}`;
                    user_details.appendChild(userName_commented);
                    
                    comment_display_Info.appendChild(user_details);

                    let Date_commented = document.createElement('small');
                    Date_commented.textContent = `${comment.date}`; 
                    Date_commented.classList.add("commentTime");
                    comment_display_Info.appendChild(Date_commented);

                    let User_comment_details = document.createElement("p");
                    User_comment_details.classList.add("commentContent");
                    User_comment_details.innerHTML = `${comment.comment_content}`;
                    comment_display_Info.appendChild(User_comment_details);

                    comments_part.insertBefore(comment_display_Info, comments_part.firstChild);
                });

                display_Comments(comments_part);
                document.getElementById(`commentText-${place_Id}`).value = "";
            } catch (e) {
                alert("Failed to add comment. Please try again later!");
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
let comment_form = document.querySelectorAll(".comment_Form");

function display_Comments(display_Info) {
    const comments = display_Info.querySelectorAll('.comment_display_info');
    const view_More_comment = display_Info.querySelector('.view_More_comments');

    if (!view_More_comment) 
        return; 

    if (comments.length <= 3) {
        view_More_comment.classList.add("hidden");
      } else {
        view_More_comment.classList.remove("hidden");
      }

    comments.forEach((comment, index) => {
        if (index > 2) {
            comment.classList.add("hidden");
        }
    });
 
    view_More_comment.addEventListener("click", () => {
        const isViewLess = view_More_comment.classList.contains("view_less");
    
        if (isViewLess) {
          comments.forEach((comment, index) => {
            if (index > 2) {
              comment.classList.add("hidden");
            }
          });
          view_More_comment.textContent = "View More";
          view_More_comment.classList.remove("view_less");
        } else {
          comments.forEach((comment) => comment.classList.remove("hidden"));
          view_More_comment.textContent = "View Less";
          view_More_comment.classList.add("view_less");
        }
      });
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
        if(!comment_Text)
        {
            alert("Comments cannot be empty");
            return;
        }

        let userNameElement = commentForm.querySelector(".userName");
        let userName = userNameElement.textContent.trim();

        try
        {
            const response = await fetch(`/places/placepage/${place_Id}/comments`, {
                method : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({comment_Text : comment_Text, user_name: userName})
            });
            if(!response.ok)
            {
                throw "Failed to post comment!";
            }
            
            let comments_updated = await response.json();
            let comments_part = document.getElementById(`comments_list_${place_Id}`);
            comments_part.innerHTML = "";
            comments_updated.forEach((comment) => {
                let comment_display_Info = document.createElement("div");
                comment_display_Info.classList.add("comment_display_info");
                
                let userName_commented = document.createElement("p");
                userName_commented.classList.add('userName');
                userName_commented.innerHTML = `${comment.userName}`;


                comment_display_Info.appendChild(userName_commented);
                
                let Date_commented = document.createElement('small');
                let commentDate = new Date(comment.date);
                Date_commented.textContent = commentDate.toLocaleString();
                Date_commented.classList.add("commentTime");
                comment_display_Info.appendChild(Date_commented);

                let User_comment_details = document.createElement("p");
                User_comment_details.classList.add("commentContent");
                User_comment_details.innerHTML = `${comment.comment_content}`;
                comment_display_Info.appendChild(User_comment_details);

                comments_part.insertBefore(comment_display_Info, comments_part.firstChild);
            });

            if (comments_updated.length > 3) {
                let expanded_comments_display = document.createElement("button");
                expanded_comments_display.textContent = "View More";
                expanded_comments_display.classList.add("view_More_comments");
                comments_part.appendChild(expanded_comments_display);
            } else {
                const existingButton = comments_part.querySelector('.view_More_comments');
                if (existingButton) {
                    existingButton.remove(); 
                }
            }

            display_Comments(comments_part);
            document.getElementById(`commentText-${place_Id}`).value = "";
        }
        catch(e)
        {
            alert("Failed to add comment. Please try again later!");
        }
    });
});
});


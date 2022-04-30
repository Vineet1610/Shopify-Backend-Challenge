window.onload = (function(){
    "use strict";
    displayItems();
    // Global Variables
    let currentIndex = -1;
    let currentCommentIndex = 0;

    document.getElementById("create-form").style.display = "none";
    document.getElementById("edit-form").style.display = "none";

    // Toggle add item button
    document.getElementById("add-item").addEventListener('click', function(){
        if(document.getElementById("create-form").style.display !== "none")
        {
            document.getElementById("create-form").style.display = "none";
        }
        else
        {
            document.getElementById("create-form").style.display = "flex";
        }
    });

    // Toggle edit item button
    document.getElementById("edit-item").addEventListener('click', function(){
        if(document.getElementById("edit-form").style.display !== "none")
        {
            document.getElementById("edit-form").style.display = "none";
        }
        else
        {
            document.getElementById("edit-form").style.display = "flex";
        }
    });

    // Display the image in UI based on the current image index
    function displayItems()
    {
        document.getElementById("inventory-items").style.display = "inline";
        document.getElementById("items").style.display = "flex";
        document.querySelector("#items").innerHTML = '';
        
        // Call get image api
        api.getItems(function(err, items){
            if (err) return onError(err);
            document.getElementById("empty-text").style.display = "none"; // Remove empty inventory item text

            for(let i = 0; i < items.length; i++)
            {
                let item = items[i];
                // Create HTML for the item
                let elmt = document.createElement('div');
                elmt.className = "item";
                elmt.id = item._id;
                let date = item.updatedAt;
                elmt.innerHTML = `
                    <div class="display-items">
                        <div id="id-prod"> ${item._id} </div>
                        <div id="update"> ${new Date(date).toLocaleDateString()} </div>
                        <div id="prod-name"> ${item.product} </div>
                        <div id="amount-prod"> ${item.amount} </div>
                        <div class="delete-icon icon"></div>
                    </div>
                `;


                // Delete the current image and if another image present then display it otherwise display empty image text
                elmt.querySelector('.delete-icon').addEventListener('click', function(){
                    api.deleteImage(image._id, function(err, images){
                        if (err) return onError(err);
                        api.getItems(function(err, remImages){
                            if (err) return onError(err);
                            console.log(remImages);

                            if(currentIndex === -1)
                            {
                                document.getElementById("images-comments").style.display = "none";
                                document.getElementById("images").style.display = "none";
                                document.getElementById("empty-text").style.display = "block";
                            }
                            else
                            {
                                displayItems();
                            }  
                        });
                    });
                });

                // add this element to the document
                document.getElementById("items").appendChild(elmt);
            }
            let elmt2 = document.createElement('div');
            elmt2.className = "left-arrow-icon icon";
            elmt2.id = "left-arrow";
            document.getElementById("arrows").appendChild(elmt2);

            let elmt3 = document.createElement('div');
            elmt3.className = "right-arrow-icon icon";
            elmt3.id = "right-arrow";
            document.getElementById("arrows").appendChild(elmt3);
            // Go to the next image when right arrow is clicked. 
            // If it is the last image then on clicking go back to the first image in the array
            elmt3.querySelector('#right-arrow').addEventListener('click', function(){
                api.getImages(function(err, images){
                    if (err) return onError(err);
                    
                    displayItems();
                });
            });

            // Go to the previous image when left arrow is clicked. 
            // If it is the first image then on clicking go back to the last image in the array
            elmt2.querySelector('#left-arrow').addEventListener('click', function(){
                api.getImages(function(err, images){
                    if (err) return onError(err);
                    
                    displayItems();
                });
            });
        });
    }

    document.getElementById("add-item-form").addEventListener('submit', function(e){
        e.preventDefault(); // prevent from refreshing the page on submit

        // read form elements
        let product = document.getElementById("product-name").value;
        let amount = document.getElementById("amount").value;

        // clean form
        document.getElementById("add-item-form").reset();

        // Call add image api and display the image
        api.addItem(product, amount, function(err){
            if (err) return onError(err);
            currentIndex++;
            displayItems();
        });
        
        document.getElementById("create-form").style.display = "none"; // hide the upload form
    });

    // Display comments for the current image
    function displayComments()
    {
        api.getImages(function(err, images){
            if (err) return onError(err);
            let image = images[currentIndex]; // get currently displayed image
            let id_image = image._id;
            let date = image.createdAt;

            // Call get comments api 
            api.getComments(id_image, currentCommentIndex, function(err, comments){
                if (err) return onError(err);

                // Create HTML for the comments
                document.querySelector("#comments").innerHTML = '';
                comments.forEach(function(comment) {
                    let elmt = document.createElement('div');
                    elmt.className = "comment-content";
                    elmt.innerHTML = `
                        <div class="comment-section">
                            <div class="top-elem">
                                <div class="author-name">${comment.comment_author}</div>
                                <div class="delete-icon icon"></div>
                            </div>
                            <div class="comment-date">Posted on ${new Date(date).toLocaleDateString()}</div>
                            <div class="author-comment">${comment.comment}</div>
                        </div>
                    `;

                    // Delete the comment in the current image
                    elmt.querySelector(".delete-icon").addEventListener('click', function(){
                        api.deleteComment(comment._id, function(err, res){
                            displayComments();
                        });
                    });

                    // add this element to the document
                    document.getElementById("comments").append(elmt);
                });

                // Add next and previous arrows for pagination in comments
                let elmt2 = document.createElement('div');
                elmt2.id = "arrows";
                elmt2.innerHTML= `
                    <div id="left-arrow-comment" class="left-arrow-icon icon"></div>
                    <div id="right-arrow-comment" class="right-arrow-icon icon"></div>
                `;

                // When there are more than 10 comments, then click on the right arrow to view the oldest comments
                elmt2.querySelector("#right-arrow-comment").addEventListener('click', function(){
                    if((currentCommentIndex + 10) === comments.length)
                    {
                        api.getComments(id_image, currentCommentIndex, function(err, comment){
                            if (err) return onError(err);
                            currentCommentIndex = currentCommentIndex + 10;
                            displayComments();
                        }); 
                    }
                });

                // When there are more than 10 comments, then click on the left arrow to view the newest comments
                elmt2.querySelector("#left-arrow-comment").addEventListener('click', function(){
                    if(currentCommentIndex === 0)
                    {
                        currentCommentIndex = 0;
                    }
                    else
                    {
                        api.getComments(id_image, currentCommentIndex, function(err, comment){
                            if (err) return onError(err);
                            currentCommentIndex = currentCommentIndex - 10;
                            displayComments();
                        }); 
                    }
                });

                // add this element to the document
                document.getElementById("comments").append(elmt2); 
            });
        });
    }

    document.getElementById("add-comment-form").addEventListener('submit', function(e){
        e.preventDefault(); // prevent from refreshing the page on submit

        // read form elements
        let author = document.getElementById("comment-author").value;
        let comment = document.getElementById("comment").value;

        // clean form
        document.getElementById("add-comment-form").reset();

        api.getImages(function(err, images){
            if (err) return onError(err);
            let image = images[currentIndex];
            let imageId = image._id;
            
            // Call the add comment api
            api.addComment(imageId, author, comment, function(err){
                if (err) return onError(err);
                displayComments();
            });
        });
    });
}());
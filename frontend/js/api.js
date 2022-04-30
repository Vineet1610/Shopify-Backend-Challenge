var api = (function(){
    var module = {};
    
    if (!localStorage.getItem('pageIndex')){
        localStorage.setItem('pageIndex', JSON.stringify({counter: 0}));
    }

    // Sends data to backend in JSON format
    function send(method, url, data, callback){
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (xhr.status !== 200) callback("[" + xhr.status + "]" + xhr.responseText, null);
            else callback(null, JSON.parse(xhr.responseText));
        };
        xhr.open(method, url, true);
        if (!data) xhr.send();
        else{
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(data));
        }
    }
    
    // add an image to the gallery
    module.addItem = function(product, amount, callback){
        send("POST", "/api/createInventory/", {product: product, amount: amount}, function(err, res){
            if (err) return callback(err);
            return callback(null);
       });
    };

    // get all images for the gallery
    module.getItems = function(callback){
        send("GET", "/api/inventory?pageIndex=1", null, callback);
    };
    
    // delete an image from the gallery given its imageId
    module.deleteImage = function(imageId, callback){
        send("DELETE", "/api/images/" + imageId + "/", null, callback, function(err, res){
            if (err) return callback(err);
            else return callback(null);
        });
    };
    
    // add a comment to an image
    module.addComment = function(imageId, author, content, callback){
        send("POST", "/api/images/" + imageId + "/comments/", {comment_author: author, comment: content}, callback, function(err, res){
            if (err) return callback(err);
            else return callback(null);
        });
    };

    // Get comments for that image and pagination
    module.getComments = function(imageId, commIndex, callback){
        send("GET", "/api/images/" + imageId + "/comments/?commentIndex=" + commIndex, null, callback);
    };
    
    // delete a comment to an image
    module.deleteComment = function(commentId, callback){
        send("DELETE", "/api/comment/" + commentId + "/", null, callback, function(err, res){
            if (err) return callback(err);
            else return callback(null);
        });
    };  
    
    return module;
})();
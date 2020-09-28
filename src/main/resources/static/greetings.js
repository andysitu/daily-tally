window.onload = function() {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function(e){
        console.log(this.responseText);
    });

    xhr.open('POST', '/create_task');
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({
        "name": "test",
        "extra": "boo"
    }));
};
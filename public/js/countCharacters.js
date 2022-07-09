var myText = document.getElementById("Message");
var countChar = document.getElementById("countCharacter");
var limit = 250;

countChar.textContent = 0 + "/" + limit;

myText.addEventListener("input", function(){
    var textLength = myText.value.length;
    countChar.textContent = textLength + "/" + limit;

    if(textLength > limit){
        myText.style.borderColor = "#ff2851";
        countChar.style.color = "#ff2851";
        document.getElementById("disabledWhenCountIncr").disabled = true;
        document.getElementById("disabledWhenCountIncr").style.cssText = "pointer-events: none; opacity: 0.6";
    }
    else {
        myText.style.borderColor = "#b2b2b2";
        countChar.style.color = "#737373";
        document.getElementById("disabledWhenCountIncr").disabled = false;
    }
})

//Checks and updates character count for tweet currently being composed, purely aesthetic purposes here
$(document).ready(function() {
  $(".transparent").on('input', function() {
    let tweet = $(this).val().length;
    const parent = $(this).parent();
    let counterValue = $(parent).children().children('output').eq(0)["0"]
    counterValue.innerHTML = 140 - tweet;

    if (counterValue.innerHTML < 0) {
      counterValue.style.color = "red"; //red when value is negative
    }
    if (counterValue.innerHTML >= 0) { // grey color used sitewide when positive
      counterValue.style.color = "#545149";
    }
  });
});
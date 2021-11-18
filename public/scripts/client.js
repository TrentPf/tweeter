/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {

  $("form").on("submit", function(event) { //Check tweet submission
    event.preventDefault(); //Use ajax instead of default to prevent page refresh/redirect
    const serialized = $("form").serialize();
    const content = $(".transparent").val();

    if (content.length === 0) { //no content in tweet, produce error
      $(".error").slideDown(400);

    }
    
    else if (content.length > 140) { //too many characters, produce error
      $(".error").slideDown(400);
    }

    else if (content.length <= 140) { //If within allowed range, produce tweet, slide up error message if it's currently displayed
      $(".error").slideUp(400);
      $.ajax({
        url: "/tweets",
        method: "POST",
        data: serialized,
        success: function () { //on successful post request, use loadTweets
          loadTweets();
        }
      });
    }
  });

  const loadTweets = function() { // loads tweets on page by ajax get request
    $.ajax({
      url: "/tweets",
      method: "GET",
      success: function (response) { // on successful get request, use renderTweets and...
        $(".tweets").html(""); // ...Clear tweets before posting, so tweets aren't duplicated
        renderTweets(response); 
      }
    });
  };

  const createTweetElement = function(tweet) {
    const safeText = renderSafe(tweet.content.text); // render content of tweet with html safe for use

    const article = '<article class="showBorder">';
    const header = `<header class="tweetHead"><span class="align grey"><img class="tweetProfile" src="${tweet.user.avatars}"></img>${tweet.user.name}</span><span class="transparency blue">${tweet.user.handle}</span></header>`;
    const body = `<div class="new-tweet tweetInset">${safeText}</div>`;

    const dateCreated = timeago.format(tweet.created_at); // timeago library to convert number into human-legible date of submission for tweet

    const footer = `<footer class="dividerLine paddingSides paddingBottom"><span class="dateFormat marginTop">${dateCreated}</span><span><i class="fas fa-flag blue iconFormat"></i><i class="fas fa-retweet blue iconFormat"></i><i class="fas fa-heart blue iconFormat"></i></span></footer>`;
    const $tweet = $(`${article}${header}${body}${footer}</article>`); // structure of html, this and previous const until just before const safeText. 
    return $tweet;
  };

  const renderTweets = function(tweets) { //Renders each tweet via using createTweetElement on each one
    for (const tweet of tweets) {
      const $tweet = createTweetElement(tweet);
      $('.tweets').prepend($tweet); // prepend the new tweet to the container of tweets
    }
  };

  const renderSafe = function(text) { // eliminate ability for tags in content of tweet to affect the page
    let renderedSafe = document.createElement("div");
    renderedSafe.appendChild(document.createTextNode(text));
    return renderedSafe.innerHTML;
  };

  loadTweets(); // for initial load of tweets
});
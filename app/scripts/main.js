$(document).ready(function () {
  // const API_ROOT = 'http://192.168.128.111:3000';
  const API_ROOT = 'http://word-dict.herokuapp.com';

  var appendDefinition = function (entry) {
    var definition = $(
      "<a href='#' class='list-group-item'>" +
      "<h4 class='list-group-item-heading'>" + entry.word + "</h4>" +
      "<p class='list-group-item-text'>" + entry.definition + "</p></a>"
    );
    $('.word-list ').append(definition)
    return definition;
  }

  var handleAJAXError = function(jqXHR, textStatus, errorThrown ) {
    console.log(textStatus, errorThrown);
  };

  var handleWordList = function(data) {
    $.each(data, function(entry) {
      appendDefinition(this);
    });
  };

  $('.add-definition-form').on('submit', function (event) {
    event.preventDefault();
    $('.add-definition-modal').modal('hide');
    var entry = {
      word: $('input[name=word]', this).val(),
      definition: $('textarea[name=definition]', this).val()
    }
    var newDefinition = appendDefinition(entry);

    newDefinition.addClass("highlight");
    setTimeout(function () {
      newDefinition.removeClass("highlight");
    }, 1000);

    $.ajax(API_ROOT + '/create', { //search
      method: 'POST',  //GET
      data: entry   // q:
    }).done(function (data) {  //use .empty method
      newDefinition.addClass("highlight");
      setTimeout(function () {
        newDefinition.removeClass("highlight");
      }, 1000);
    }).fail(handleAJAXError);
  })

  $('.word-search-form').on('submit', function(event) {
    event.preventDefault(); //stops form from being submitted (reloading on search click never triggers)
    $.ajax(API_ROOT + '/search', {  //actual ajax request
      data: $(this).serialize(),  //creates the following url http://word-dict.herokuapp.com/search?q=cat
    }).done(function(data) {
      $('.word-list').empty();  //runs jQuery empty fuction on word list that empties word list except for search results
      handleWordList(data);  //see handleWordList function above
    }).fail(handleAJAXError);
  });

  $.ajax(API_ROOT + '/words.json')
    .done(handleWordList)
    .fail(handleAJAXError);
});

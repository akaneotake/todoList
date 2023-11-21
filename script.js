$(document).ready(function() {
  // GET tasks
  $.ajax({
    type: 'GET',
    url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=1090',
    dataType: 'json',
    success: function(response, textStatus) {
      response.tasks.forEach(function(task) {
        $('#list').append('<p>' + task.content + '</P>');
      });
    },
    error: function(request, textStatus, errorMessage) {
      console.log(errorMessage);
    }
  });

  // POST tasks
  var addTask = function() {
    var newTask = document.getElementById('newTask').value;
    if (newTask) {
      $.ajax({
        type: 'POST',
        url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=1090',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
          task: {
            content: newTask
          }
        }),
        success: function(response, textStatus) {
          $('#list').append('<p>' + response.task.content + '</P>');
          console.log(response.task.content);
        },
        error: function(request, textStatus, errorMessage) {
          console.log(errorMessage);
        }
      });
    };
  };

  $('#addBtn').on('click', addTask);
});



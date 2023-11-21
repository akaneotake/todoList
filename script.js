$(document).ready(function() {
  // GET tasks
  var displayTasks = function() {
    $.ajax({
      type: 'GET',
      url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=1090',
      dataType: 'json',
      success: function(response, textStatus) {
        response.tasks.forEach(function(task) {
          $('#list').append('<p>' + task.content + '<button class="deleteBtn" data-id="' + task.id + '">DELETE</button></P>');
        });
      },
      error: function(request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  };

  // POST tasks
  var addTask = function() {
    if ($('#newTask').val()) {
      $.ajax({
        type: 'POST',
        url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=1090',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
          task: {
            content: $('#newTask').val()
          }
        }),
        success: function(response, textStatus) {
          $('#list').append('<p>' + response.task.content + '<button class="deleteBtn" data-id="' + response.task.id + '">DELETE</button></P>');
          $('#newTask').val("");
        },
        error: function(request, textStatus, errorMessage) {
          console.log(errorMessage);
        }
      });
    };
  };

  // DELETE tasks
  var deleteTask = function(id) {
    $.ajax({
      type: 'DELETE',
      url: 'https://fewd-todolist-api.onrender.com/tasks/' + id + '?api_key=1090',
      dataType: 'json',
      success: function(response, textStatus) {
        $('#list [data-id=' + id + ']').parent().remove();
      },
      error: function(request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  };


  
  // Event Handlers
  displayTasks();

  $('#addBtn').on('click', addTask);

  $(document).on('click', '.deleteBtn', function() {
    deleteTask($(this).data('id'));
  });

});
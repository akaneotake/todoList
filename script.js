$(document).ready(function() {
  // Set the date
  var showDate = function() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    return year + "/" + month + "/" + day;
  };
  document.getElementById('date').innerHTML = showDate();

  // GET tasks
  var displayTasks = function() {
    $.ajax({
      type: 'GET',
      url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=1090',
      dataType: 'json',
      success: function(response, textStatus) {
        $('#list').html("");
        var insertInput = function(status) {
          if (status == true) {
            return '<input class="checkbox completed" type="checkbox" checked/>';
          } else {
            return '<input class="checkbox active" type="checkbox" />';
          };
        };
        response.tasks.forEach(function(task) {
          $('#list').append('<p data-id=' + task.id + '>' + insertInput(task.completed) + task.content + '<i class="fa-regular fa-trash-can deleteBtn"></i></P>');
        });
      },
      error: function(request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  };

  // Create tasks (POST)
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
          $('#list').append('<p data-id=' + response.task.id + '><input class="checkbox active" type="checkbox" />' + response.task.content + '<i class="fa-regular fa-trash-can deleteBtn"></i></P>');
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
        $('#list [data-id=' + id + ']').remove();
      },
      error: function(request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  };

  // Mark Completed (PUT)
  var markCompleted = function(id) {
    $.ajax({
      type: 'PUT',
      url: 'https://fewd-todolist-api.onrender.com/tasks/' + id + '/mark_complete?api_key=1090',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({
        task: {
          completed: true
        }
      }),
      success: function(response, textStatus) {
        console.log(response);
      },
      error: function(request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  };
  
  // Return Active (PUT)
  var returnActive = function(id) {
    $.ajax({
      type: 'PUT',
      url: 'https://fewd-todolist-api.onrender.com/tasks/' + id + '/mark_active?api_key=1090',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({
        task: {
          completed: false
        }
      }),
      success: function(response, textStatus) {
        console.log(response);
      },
      error: function(request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  };


  // Functions and Event Handlers
  // Get and render all tasks
  displayTasks();

  // Add a new task by clicking add button
  $('#addBtn').on('click', addTask);

  // Delete the task by clicking delete button
  $(document).on('click', '.deleteBtn', function() {
    deleteTask($(this).parent('p').data('id'));
  });

  // Change the task status completed/Active by checkbox
  $(document).on('change', '.checkbox', function() {
    if (this.checked) {
      markCompleted($(this).parent('p').data('id'));
      $(this).removeClass('active');
      $(this).addClass('completed');
    } else {
      returnActive($(this).parent('p').data('id'));
      $(this).removeClass('completed');
      $(this).addClass('active');
    }
  });

  // Filter the tasks by All/Active/Completed
  // All
  $(document).on('click', '#allBtn', displayTasks);

  // Active
  $(document).on('click', '#activeBtn', function() {
    $.ajax({
      type: 'GET',
      url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=1090',
      dataType: 'json',
      success: function(response, textStatus) {
        $('#list').html("");
        response.tasks.forEach(function(task) {
          if (task.completed == false) {
            $('#list').append('<p data-id=' + task.id + '><input class="checkbox active" type="checkbox" />' + task.content + '<i class="fa-regular fa-trash-can deleteBtn"></i></P>');
          }
        });
      },
      error: function(request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    }); 
  });

  // Completed
  $(document).on('click', '#CompletedBtn', function() {
    $.ajax({
      type: 'GET',
      url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=1090',
      dataType: 'json',
      success: function(response, textStatus) {
        $('#list').html("");
        response.tasks.forEach(function(task) {
          if (task.completed == true) {
            $('#list').append('<p data-id=' + task.id + '><input class="checkbox completed" type="checkbox" checked/>' + task.content + '<i class="fa-regular fa-trash-can deleteBtn"></i></P>');
          }
        });
      },
      error: function(request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    }); 
  });


});
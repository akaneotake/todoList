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
  var filterState = "all";
  var displayTasks = function() {
    $.ajax({
      type: 'GET',
      url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=1090',
      dataType: 'json',
      success: function(response, textStatus) {
        $('#activeBtn, #CompletedBtn').css('background-color', '');
        $('#allBtn').css('background-color', 'lightgray');
        $('#list').empty();
        response.tasks.filter(function(task) {
          if (filterState === "all") {
            $('#activeBtn, #CompletedBtn').css('background-color', '');
            $('#allBtn').css('background-color', 'lightgray');
            return true;
          } else if (filterState === "active") {
            $('#allBtn, #CompletedBtn').css('background-color', '');
            $('#activeBtn').css('background-color', 'lightgray');
            return task.completed === false;
          } else if (filterState === "completed") {
            $('#allBtn, #activeBtn').css('background-color', '');
            $('#CompletedBtn').css('background-color', 'lightgray');
            return task.completed === true;
          }
        }).sort(function(a, b) {
        return a.id - b.id;
      }).forEach(function(task) {
        $('#list').append('<p data-id=' + task.id + '><input type="checkbox" class="checkbox ' + (task.completed?'completed' : 'active') + '" ' + (task.completed?'checked' : '') + ' />' + task.content + '<i class="fa-regular fa-trash-can deleteBtn"></i></P>');
      });
      $('#itemNum').html($('#list p').length);
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
          $('#newTask').val("");
          displayTasks();
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
      success: function(response, textStatus) {
        displayTasks();
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
      success: function(response, textStatus) {
        displayTasks();
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
      success: function(response, textStatus) {
        displayTasks();
      },
      error: function(request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  };

  // Functions and Event Handlers
  // Add a new task by clicking add button
  $('#addBtn').on('click', addTask);
  $('#newTask').keypress(function(e) {
    if (e.which === 13) {
      addTask();
    }
  });
  
  // Delete the task by clicking delete button
  $(document).on('click', '.deleteBtn', function() {
    deleteTask($(this).parent('p').data('id'));
  });

  // Change the task status completed/Active by checkbox
  $(document).on('change', '.checkbox', function() {
    if (this.checked) {
      markCompleted($(this).parent('p').data('id'));
    } else {
      returnActive($(this).parent('p').data('id'));
    }
  });

  // Filter the tasks by All/Active/Completed
  // All
  $(document).on('click', '#allBtn', function() {
    filterState = "all";
    displayTasks();
  });

  // Active
  $(document).on('click', '#activeBtn', function() {    
    filterState = "active";
    displayTasks();
  });
    
  // Completed
  $(document).on('click', '#CompletedBtn', function() {
    filterState = "completed";
    displayTasks();
  });

  // Clear completed tasks by clicking "Clear Completed" button
  $(document).on('click', '#clearCompletedBtn', function() {
    var completedIds = [];
    $('#list p').each(function(i, ele) {
      if ($(ele).children('input').hasClass('completed') == true) {
        completedIds.push($(ele).attr('data-id'));
      };
    });
    completedIds.forEach(function(id) {
      deleteTask(id);
    });
  });

  // Get and render all tasks
  displayTasks();
});
// Generated by CoffeeScript 1.6.1
(function() {
  var Sidebar, collection;

  Sidebar = Backbone.Model.extend({
    promptColor: function() {
      var cssColor;
      cssColor = prompt("Please enter a CSS color:");
      return this.set({
        color: cssColor
      });
    }
  });

  window.sidebar = new Sidebar;

  sidebar.on('change:color', function(model, color) {
    return $('#sidebar').css({
      background: color
    });
  });

  sidebar.set({
    color: 'white'
  });

  $('#button-change-color').click(function() {
    return sidebar.promptColor();
  });

  collection = new Backbone.Collection([
    {
      name: "Tim",
      age: 5
    }, {
      name: "Ida",
      age: 26
    }, {
      name: "Rob",
      age: 55
    }
  ]);

  $('#button-show-collection').click(function() {
    return $('#content').html(JSON.stringify(collection));
  });

}).call(this);
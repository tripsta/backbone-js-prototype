// model definition
var Sidebar = Backbone.Model.extend({
  promptColor: function() {
    var cssColor = prompt("Please enter a CSS color:");
    this.set({color: cssColor});
  }, 
});

// instantiate model
window.sidebar = new Sidebar;

// when model's event is called, change dom element's attribute (sidebar color)
sidebar.on('change:color', function(model, color) {
  $('#sidebar').css({background: color});
});

// initializing color
sidebar.set({color: 'white'});

//call model's method
$('#button-change-color').click(function() {
	sidebar.promptColor();	
});

var collection = new Backbone.Collection([
  {name: "Tim", age: 5},
  {name: "Ida", age: 26},
  {name: "Rob", age: 55}
]);

$('#button-show-collection').click(function() {
	$('#content').html(JSON.stringify(collection));
});

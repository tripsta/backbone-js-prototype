Sidebar = Backbone.Model.extend {
  promptColor: () ->
    cssColor = prompt "Please enter a CSS color:"
    @.set {color: cssColor}
  , 
}

window.sidebar = new Sidebar

# when model's event is called, change dom element's attribute (sidebar color)
sidebar.on 'change:color', (model, color) ->
  $('#sidebar').css {background: color}


# // initializing color
sidebar.set {color: 'white'}

# //call model's method
$('#button-change-color').click () ->
	sidebar.promptColor()


collection = new Backbone.Collection [
  {name: "Tim", age: 5},
  {name: "Ida", age: 26},
  {name: "Rob", age: 55}
]

$('#button-show-collection').click () ->
	$('#content').html JSON.stringify(collection)


define ->
	AddView = Backbone.View.extend(
	  events:
	    'click .button_add': 'add'

	  initialize: ->
	    @render() 
	  render: -> # Compile the template using underscore 
	    template = _.template($("#add_template").html(), {}) 
	  # Load the compiled HTML into the Backbone "el" 
	    @$el.html template
	  add: ->   
	    @collection.add
	      name : $('#new_name').val()
	      age : $('#new_age').val()
	      city : $('#new_city').val()
	    window.originalCollection.reset(@collection.models)
	)
	AddView
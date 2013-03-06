define ->
	CustomerView = Backbone.View.extend(
	  events:
	    'click .button_remove': 'remove'
	  template : _.template($(".customer_template").html())
	  initialize: -> 
	  render: ->
	    @$el.html @template(@model.toJSON())
	    @delegateEvents()
	    @
	  remove: ->
	    @model.destroy()
	)
	CustomerView
define ->
	FilterCityView = Backbone.View.extend(
	  events:
	    'change .filter_city_item' : 'onItemChanged'
	  template: _.template $(".filter_city_template").html()
	  render: ->
	    @$el.html @template(@model.toJSON())
	    @
	  onItemChanged: (event) ->
	    @model.set 'checked', event.target.checked
	)
	FilterCityView

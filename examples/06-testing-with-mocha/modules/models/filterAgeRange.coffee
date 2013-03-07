define ->
	class FilterAgeRange extends Backbone.Model

	  min_age: null
	  max_age: null

	  initialize: (@originalCollection, @customerCollection) ->
	    @originalCollection.on 'reset', @render, this

	  render: ->
	    @min_age = @originalCollection.min((m) -> m.get("age")).get('age')
	    @max_age = @originalCollection.max((m) -> m.get("age")).get('age')

	    $('#age_slider').slider(
	      range: yes
	      min: @min_age
	      max: @max_age
	      values: [@min_age, @max_age]
	      slide: (event, ui) =>
	        @min_age = ui.values[0]
	        @max_age = ui.values[1]
	        @customerCollection.reset @originalCollection.applyFilters()

	        $("#age_display_range").val "#{@min_age} - #{@max_age}"
	    )
	    $("#age_display_range").val "#{@min_age} - #{@max_age}"

	FilterAgeRange
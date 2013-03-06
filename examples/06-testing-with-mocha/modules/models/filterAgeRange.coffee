define ->
	FilterAgeRange = Backbone.Model.extend(
	  initialize: (collection) ->
	    @collection = collection
	    @collection.on 'reset', @render, this
	  min_age: null
	  max_age: null
	  render: ->
	    @min_age = window.originalCollection.min((model) ->
	        model.get("age")
	    ).get('age')
	    @max_age= window.originalCollection.max((model) ->
	        model.get("age")
	    ).get('age')
	    $('#age_slider').slider(
	      range: true
	      min: @min_age
	      max: @max_age
	      values: [@min_age, @max_age]
	      slide: (event, ui) =>
	        @min_age = ui.values[0]
	        @max_age = ui.values[1]
	        data = window.originalCollection.applyFilters()
	        window.customerCollection.reset(data)
	        $( "#age_display_range" ).val "#{@min_age} - #{@max_age}"
	    )
	    $( "#age_display_range" ).val "#{@min_age} - #{@max_age}"
	)
	FilterAgeRange
define ['cs!/modules/views/filterCityView'], (FilterCityView) ->
	FilterCityCollectionView = Backbone.View.extend(
	  initialize : ->
	    @listenTo @collection, 'filterCity::change', @render
	  _renderOne: (model) ->
	      v = new FilterCityView(
	        model: model,
	        tagName: 'li'
	      )
	      @$el.append v.render().el
	  render: ->
	    $(@el).empty()
	    @collection.each @_renderOne, this
	    $('.filter_city_item').change =>
	      @trigger('cityChanged')
	)
	FilterCityCollectionView
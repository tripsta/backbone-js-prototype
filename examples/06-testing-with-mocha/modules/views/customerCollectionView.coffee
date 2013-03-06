define ['cs!/modules/views/customerView'], (CustomerView) ->
  CustomerCollectionView = Backbone.View.extend(
    initialize : ->
      @listenTo @collection, 'customer_collection::onCollectionChanged', @render
    _renderOne: (model) ->
        v = new CustomerView(
          model : model,
          tagName : 'li'
        )
        @$el.append v.render().el
    render: ->
      $(@el).empty()
      @collection.each @_renderOne, @
  )
  CustomerCollectionView
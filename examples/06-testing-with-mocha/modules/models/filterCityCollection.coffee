define ->
  FilterCityCollection = Backbone.Collection.extend(
    initialize : (collection) ->
      @collection = collection
      @listenTo(@collection, 'customer_collection::onCollectionChanged', @onCollectionChanged)
      @on('change', @onCityItemChanged)
    onCityItemChanged: (model, options) ->
        data = originalCollection.applyFilters()
        window.customerCollection.reset(data)
    onCollectionChanged: ->
      @reload()
    reload: ->
      cities = _.uniq @collection.pluck('city')
      @reset()
      $.each(cities, (index, value) =>
        @add(new Backbone.Model(name: value, checked: true), silent: true)
      )
      @trigger 'filterCity::change'
  )
  FilterCityCollection
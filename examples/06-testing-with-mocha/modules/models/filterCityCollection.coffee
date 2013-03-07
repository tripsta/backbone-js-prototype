define ->
  FilterCityCollection = Backbone.Collection.extend(
    initialize : (originalCollection, customerCollection) ->
      @originalCollection = originalCollection
      @customerCollection = customerCollection
      @originalCollection.on 'customer_collection::onCollectionChanged', @onCollectionChanged, this
      @on('change', @onCityItemChanged)
    onCityItemChanged: (model, options) ->
        data = @originalCollection.applyFilters()
        @customerCollection.reset(data)
    onCollectionChanged: ->
      @reload()
    reload: ->
      cities = _.uniq @originalCollection.pluck('city')
      @reset()
      _.each(cities, (city) =>
        @add(new Backbone.Model(name: city, checked: true), silent: true)
      )
      @trigger 'filterCity::change'
  )
  FilterCityCollection
define ->
  CustomerCollection = Backbone.Collection.extend(
    initialize: ->
      @on 'reset', @onCollectionChanged, this
      @on 'remove', @onCollectionChanged, this
      @on 'add', @onCollectionChanged, this
    filterByAge: null
    filterByCity: null
    deepClone: ->
      clonedCollection = new Backbone.Collection()
      @each (customer)->
        clonedCollection.add(new Backbone.Model(customer.toJSON()))
      clonedCollection
    applyFilters: ->
      currentCollection = @deepClone()
      filtered = currentCollection.models
      if (@filterByAge) 
        filtered = currentCollection.filter((model)=>
          @filterByAge.min_age <= model.get('age') <= @filterByAge.max_age
        )
      currentCollection.reset filtered
      if (@filterByCity)
        cities = _.map(@filterByCity.filter((model) ->
          model.get('checked') is true), (m) -> m.get('name'))
        filtered = currentCollection.filter (model) ->
          ($.inArray(model.get('city'), cities) != -1)
      filtered
    onCollectionChanged: ->
      @trigger 'customer_collection::onCollectionChanged', this
  )
  CustomerCollection
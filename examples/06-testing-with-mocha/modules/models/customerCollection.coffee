console.log 'CustomerCollection loaded'
define ->
  class CustomerCollection extends Backbone.Collection

    filterByAge: null
    filterByCity: null

    initialize: ->
      @on 'reset remove add', @onCollectionChanged, @

    deepClone: -> new Backbone.Collection(@toJSON())

    applyFilters: ->
      filtered = @models

      if @filterByAge
        filtered = _(filtered).filter (model) =>
          @filterByAge.min_age <= model.get('age') <= @filterByAge.max_age

      if @filterByCity
        cities = _(@filterByCity.toJSON())
          .chain()
          .filter((m) -> m.checked)
          .pluck('name')
          .value()

        filtered = _(filtered).filter (model) ->
          (_.contains(cities, model.get('city')))

      filtered

    onCollectionChanged: ->
      @trigger 'customer_collection::onCollectionChanged', @

  CustomerCollection
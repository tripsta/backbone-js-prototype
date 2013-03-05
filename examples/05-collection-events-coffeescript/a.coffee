customers_data = [
    name : 'John', age : 22, city : 'London',
  ,
    name: "Tim", age: 5, city : 'Paris',
  ,
    name: "Ida", age: 26, city : 'London',
  ,
    name: "Mary", age: 12, city : 'Athens',
  ,
    name: "Jay", age: 33, city : 'New York',
  ,
    name: "Kate", age: 24, city : 'New York',
  ,
    name: "Elio", age: 25, city : 'Porto',
  ,
    name: "Rob", age: 55, city : 'Berlin'
]

AddView = Backbone.View.extend(
  events:
    'click .button_add': 'add'

  initialize: ->
    @render() 
  render: -> # Compile the template using underscore 
    template = _.template($("#add_template").html(), {}) 
  # Load the compiled HTML into the Backbone "el" 
    @$el.html template
  add: ->   
    @collection.add
      name : $('#new_name').val()
      age : $('#new_age').val()
      city : $('#new_city').val()
    window.originalCollection.reset(@collection.models)
)

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

CustomerCollection = Backbone.Collection.extend(
  initialize: ->
    @on 'reset', @onCollectionChanged, this
    @on 'remove', @onCollectionChanged, this
    @on 'add', @onCollectionChanged, this
  filterByAge: null
  filterByCity: null
  applyFilters: ->
    currentCollection = @clone()
    filtered = currentCollection.models
    if (@filterByAge) 
      filtered = currentCollection.filter((model)=>
        model.get('age') >= @filterByAge.min_age and model.get('age') <= @filterByAge.max_age
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

FilterAgeRange = Backbone.Model.extend(
  initialize: (collection) ->
    @collection = collection
    @collection.on 'reset', @render, this
  min_age: null
  max_age: null
  render: ->
    @min_age = originalCollection.min((model) ->
        model.get("age")
    ).get('age')
    @max_age=originalCollection.max((model) ->
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
        data = originalCollection.applyFilters()
        customerCollection.reset(data)
        $( "#age_display_range" ).val "#{@min_age} - #{@max_age}"
    )
    $( "#age_display_range" ).val "#{@min_age} - #{@max_age}"
)

FilterCityCollection = Backbone.Collection.extend(
  initialize : (collection) ->
    @collection = collection
    @listenTo(@collection, 'customer_collection::onCollectionChanged', @onCollectionChanged)
    @on('change', @onCityItemChanged)
  onCityItemChanged: (model, options) ->
      data = originalCollection.applyFilters()
      customerCollection.reset(data)
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

$('.reset_filters').click ->
  window.customerCollection.reset(customers_data)
  window.filterAgeRange.render()
  window.filterCityCollection.collection = originalCollection

$('.reset_collection').click ->
  window.customerCollection.reset(customers_data)
  window.originalCollection.reset(customers_data)


customerCollection = new CustomerCollection
customerCollection.reset(customers_data)
originalCollection = customerCollection.clone()
filterCityCollection = new FilterCityCollection(originalCollection)
filterCityCollection.reload()
window.filterAgeRange = new FilterAgeRange(originalCollection)
window.filterAgeRange.render()

originalCollection.filterByAge = window.filterAgeRange
originalCollection.filterByCity = filterCityCollection
customerCollectionView = new CustomerCollectionView(
  collection : customerCollection
  el : $('ul.customers')[0]
)

add_view = new AddView(
  el: $("#add_container")
  collection : customerCollection
)

filterCityCollectionView = new FilterCityCollectionView(
  collection : filterCityCollection
  el : $('ul.filter_cities')[0]
)

customerCollectionView.render()
filterCityCollectionView.render()

var customers_data = [
  {name : 'John',  age : 22, city : 'London'},
  {name: "Tim", age: 5, city : 'Paris'},
  {name: "Ida", age: 26, city : 'London'},
  {name: "Mary", age: 12, city : 'Athens'},
  {name: "Jay", age: 33, city : 'New York'},
  {name: "Kate", age: 24, city : 'New York'},
  {name: "Elio", age: 25, city : 'Porto'},
  {name: "Rob", age: 55, city : 'Berlin'}
];

AddView = Backbone.View.extend({
  events: {
    'click .button_add': 'add'
  },  
  initialize: function(){ 
    this.render(); 
  }, 
  render: function() { // Compile the template using underscore 
    var template = _.template( $("#add_template").html(), {} ); 
  // Load the compiled HTML into the Backbone "el" 
    this.$el.html( template ); 
  }, 
  add: function() {    
    this.collection.add({
      name : $('#new_name').val(),
      age : $('#new_age').val(),
      city : $('#new_city').val()});
      window.originalCollection.reset(this.collection.models);
  }
}); 

CustomerView = Backbone.View.extend({
  events: {
    'click .button_remove': 'remove'
  },  
  template : _.template( $(".customer_template").html()),
  initialize: function(){ 
  }, 
  render: function() {
    this.$el.html( this.template(this.model.toJSON()) );
    this.delegateEvents();
    return this;
  },
  remove: function() {
    console.log('removing model:' + JSON.stringify(this.model.toJSON()))
    this.model.destroy();
  }
}); 

CustomerCollectionView = Backbone.View.extend({
  initialize : function(){
    this.listenTo(this.collection, 'customer_collection::onCollectionChanged', this.render);
  }, 
  _renderOne: function (model) {
      var v = new CustomerView({
        model : model,
        tagName : 'li'
      });
      this.$el.append(v.render().el);
  },
  render : function() {
    $(this.el).empty();
    this.collection.each(this._renderOne, this)
  }
});


FilterCityView = Backbone.View.extend({
  template : _.template( $(".filter_city_template").html()),
  render: function() {
    this.$el.html( this.template(this.model.toJSON()));
    return this;
  }
});

FilterCityCollectionView = Backbone.View.extend({
  initialize : function(){
    this.listenTo(this.collection, 'filterCity::change', this.render);
  },
  _renderOne: function (model) {
      var v = new FilterCityView({
        model : model,
        tagName : 'li'
      });
      this.$el.append(v.render().el);
  },
  render : function() {
    $(this.el).empty();
    this.collection.each(this._renderOne, this)
  },
});

CustomerCollection = Backbone.Collection.extend({
  initialize: function() {
    this.on('reset', this.onCollectionChanged, this);
    this.on('remove', this.onCollectionChanged, this);
    this.on('add', this.onCollectionChanged, this);
  },
  filterByAge: null,
  filterByCity: null,
  applyFilters: function() {
    var that = this;
    currentCollection = this.clone();
    filtered = currentCollection.models;
    if (this.filterByAge) {
      filtered = currentCollection.filter(function(model){
        return model.get('age') >= that.filterByAge.min_age && model.get('age') <= that.filterByAge.max_age;
      });
    }
    if (this.filterByCity) {
      // filtered = currentCollection.filter(function(model){
      //   return model.get('age') >= that.filterByAge.min_age && model.get('age') <= that.filterByAge.max_age;
      // });
    }
    return filtered;
  },
  onCollectionChanged: function() {
    this.trigger('customer_collection::onCollectionChanged', this);
  }

});

FilterAgeRange = Backbone.Model.extend({
  initialize: function(collection) {
    this.collection = collection;
    this.collection.on('reset', this.render, this);
  },
  min_age: null,
  max_age: null,
  render: function() {
    var that = this;
    this.min_age=originalCollection.min(function(model) {
        return model.get("age")
    }).get('age');
    this.max_age=originalCollection.max(function(model) {
        return model.get("age")
    }).get('age');
    $('#age_slider').slider({
      range: true,
      min: that.min_age,
      max: that.max_age,
      values: [that.min_age, that.max_age],
      slide: function(event, ui) {
        that.min_age = ui.values[0];
        that.max_age = ui.values[1];
        data = originalCollection.applyFilters();
        customerCollection.reset(data);
        $( "#age_display_range" ).val( that.min_age + " - " + that.max_age );
      }
    });
    $( "#age_display_range" ).val(that.min_age + " - " + that.max_age );    
  },
});

FilterCityCollection = Backbone.Collection.extend({
  initialize : function(collection) {
    this.collection = collection;
    this.listenTo(this.collection, 'customer_collection::onCollectionChanged', this.onCollectionChanged);
  },
  onCollectionChanged: function() {
    this.reload();
  },
  reload: function() {
    var cities = _.uniq(this.collection.pluck('city'));
    console.log(cities);
    this.reset();
    var that = this;
    $.each(cities, function(index, value){
      that.push(new Backbone.Model({name: value}));
    });
    this.trigger('filterCity::change');
  },
});

$('.reset_filters').click(function(){
  console.log('clicked reset');
  window.customerCollection.reset(customers_data);
  window.filterAgeRange.render();
  window.filterCityCollection.collection = originalCollection;
});

$('.reset_collection').click(function(){
  console.log('clicked reset');
  window.customerCollection.reset(customers_data);
  window.originalCollection.reset(customers_data);
});


var customerCollection = new CustomerCollection;
customerCollection.reset(customers_data);
var originalCollection = customerCollection.clone();
var filterCityCollection = new FilterCityCollection(originalCollection);
filterCityCollection.reload();
window.filterAgeRange = new FilterAgeRange(originalCollection);
window.filterAgeRange.render();

originalCollection.filterByAge = window.filterAgeRange;
originalCollection.filterByCity = filterCityCollection;
var customerCollectionView = new CustomerCollectionView({
  collection : customerCollection,
  el : $('ul.customers')[0]
});

var add_view = new AddView({ 
  el: $("#add_container"),
  collection : customerCollection
}); 

var filterCityCollectionView = new FilterCityCollectionView({
  collection : filterCityCollection,
  el : $('ul.filter_cities')[0]
});

customerCollectionView.render();
filterCityCollectionView.render();

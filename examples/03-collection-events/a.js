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
    this.collection.on('reset', this.onCollectionChanged, this);
    this.collection.on('remove', this.onCollectionChanged, this);
    this.collection.on('add', this.onCollectionChanged, this);
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
  },
  onCollectionChanged : function(model) {
    this.render();
    console.log('collection changed');
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
    this.listenTo(this.collection, 'filterCity::change', this.onCollectionChanged);
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
  onCollectionChanged : function(model) {
    this.render();
  }
});

CustomerCollection = Backbone.Collection.extend({
  initialize: function() {
    this.on('reset', this.onCollectionChanged, this);
    this.on('remove', this.onCollectionChanged, this);
    this.on('add', this.onCollectionChanged, this);
  },
  filterByAge: function(min_age, max_age){
    filtered = this.filter(function(model){
      return model.get('age') >= min_age && model.get('age') <= max_age;
    });
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
  render: function() {
    var min_age=originalCollection.min(function(model) {
        return model.get("age")
    }).get('age');
    var max_age=originalCollection.max(function(model) {
        return model.get("age")
    }).get('age');
    $( "#age_display_range" ).val( min_age + " - " + max_age );
        $('#age_slider').slider({
          range: true,
          min: min_age,
          max: max_age,
          values: [min_age, max_age],
          slide: function(event, ui) {
            data = originalCollection.filterByAge(ui.values[0], ui.values[1]);
            customerCollection.reset(data);
            $( "#age_display_range" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
          }
        });
  },
});

FilterCityCollection = Backbone.Collection.extend({
  initialize : function(collection) {
    this.collection = collection;
    this.listenTo(this.collection, 'customer_collection::onCollectionChanged', this.onCollectionChanged, this.collection);
    that = this;
  },
  onCollectionChanged: function(collection) {
    this.collection = collection;
    this.reload();
  },
  reload: function() {
    var cities = _.uniq(this.collection.pluck('city'));
    console.log(cities);
    that.reset();
    $.each(cities, function(index, value){
      that.push(new Backbone.Model({name: value}));
    });
    this.trigger('filterCity::change');
  }
});

$('.reset_filters').click(function(){
  console.log('clicked reset');
  window.customerCollection.reset(customers_data);
  window.filterAgeRange.render();
  window.filterCityCollection.collection = originalCollection;
});


var customerCollection = new CustomerCollection;
customerCollection.reset(customers_data);
var originalCollection = customerCollection.clone();
var filterCityCollection = new FilterCityCollection(originalCollection);
filterCityCollection.reload();
var filterAgeRange = new FilterAgeRange(originalCollection);
filterAgeRange.render();

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

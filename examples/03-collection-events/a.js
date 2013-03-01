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
  }
}); 

  //- See more at: http://backbonetutorials.com/what-is-a-view/#sthash.7IW3AJSO.dpuf

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
    this.collection.on('reset', this.render, this);
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
  }
});

var coll = new Backbone.Collection();
var customerCollectionView = new CustomerCollectionView({
  collection : coll,
  el : $('ul.customers')[0]
});
var add_view = new AddView({ 
  el: $("#add_container"),
  collection : coll
}); 

coll.reset(customers_data);

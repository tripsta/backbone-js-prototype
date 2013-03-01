var customers = new Backbone.Collection([
  {name : 'John',  age : 22, city : 'London'},
  {name: "Tim", age: 5, city : 'Paris'},
  {name: "Ida", age: 26, city : 'London'},
  {name: "Rob", age: 55, city : 'Berlin'}
]);

SearchView = Backbone.View.extend({ 
  initialize: function(){ 
    this.render(); 
  }, 
  render: function() { // Compile the template using underscore 
    var template = _.template( $("#search_template").html(), {} ); 
  // Load the compiled HTML into the Backbone "el" 
    this.$el.html( template ); 
  } 
}); 

var search_view = new SearchView({ el: $("#search_container") }); 
  //- See more at: http://backbonetutorials.com/what-is-a-view/#sthash.7IW3AJSO.dpuf

CustomerView = Backbone.View.extend({ 
  template : _.template( $("#customer_template").html()),
  initialize: function(){ 
    this.render(); 
  }, 
  render: function() { // Compile the template using underscore 
  // Load the compiled HTML into the Backbone "el" 
  console.log(this.model.toJSON());
    this.$el.html( this.template(this.model.toJSON()) ); 
  } 
}); 

var John = customers.first();
var john_view = new CustomerView({ el: $("#john_container"), model : John }); 


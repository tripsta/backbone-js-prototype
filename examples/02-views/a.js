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
  template : _.template( $(".customer_template").html()),
  initialize: function(){ 
  }, 
  render: function() {
    this.$el.html( this.template(this.model.toJSON()) ); 
    return this;
  } 
}); 

var John = customers.first();
var john_view = new CustomerView({ el: $("#john_container"), model : John }); 
john_view.render();


CustomerCollectionView = Backbone.View.extend({
  initialize : function(){
    var that = this;
    console.log(this.el);
    this._customerViews = [];
    this.collection.each(function(customer){
      that._customerViews.push(
        new CustomerView({
          model : customer,
          tagName : 'li'
        })
      );
    });
  }, 
  render : function() {
    var that = this;
    $(this.el).empty();
    _(this._customerViews).each(function(cv){
      console.log(cv.render());
      $(that.$el).append(cv.render().el)
    });
  }
});

var customerCollectionView = new CustomerCollectionView({
  collection : customers,
  el : $('ul.customers')[0]
});

customerCollectionView.render();
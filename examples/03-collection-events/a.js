var customers_data = [
  {name : 'John',  age : 22, city : 'London'},
  {name: "Tim", age: 5, city : 'Paris'},
  {name: "Ida", age: 26, city : 'London'},
  {name: "Rob", age: 55, city : 'Berlin'}
];

AddView = Backbone.View.extend({ 
  initialize: function(){ 
    this.render(); 
  }, 
  render: function() { // Compile the template using underscore 
    var template = _.template( $("#add_template").html(), {} ); 
  // Load the compiled HTML into the Backbone "el" 
    this.$el.html( template ); 
  } 
}); 

var add_view = new AddView({ el: $("#add_container") }); 
  //- See more at: http://backbonetutorials.com/what-is-a-view/#sthash.7IW3AJSO.dpuf

CustomerView = Backbone.View.extend({
  events: {
    'click .button_remove': 'notify'
  },  
  template : _.template( $(".customer_template").html()),
  initialize: function(){ 
  }, 
  render: function() {
    console.log(this.model.toJSON());
    this.$el.html( this.template(this.model.toJSON()) );
    this.delegateEvents();
    return this;
  },
  notify: function() {
    console.log('TODO: remove model:' + JSON.stringify(this.model.toJSON()))
  }
}); 

CustomerCollectionView = Backbone.View.extend({
  initialize : function(){
    this.collection.on('reset', this.render, this);
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

var coll = new Backbone.Collection;
var customerCollectionView = new CustomerCollectionView({
  collection : coll,
  el : $('ul.customers')[0]
});

coll.reset(customers_data);

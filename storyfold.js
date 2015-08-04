Story = new Meteor.Collection('story');

if (Meteor.isClient) {



  Template.thestory.helpers({
    'story': function(){
      return Story.find({}).fetch();
    },
    'submit': function(){
      var check = Session.get('submit');
      if(check === 'yes') {
        return true;
      } else {
        return false;
      }
    }

  });

  Router.route('index', {
    path: '/',
    template: 'newstory',
    onBeforeAction: function () {
      this.next();
    }
  });

  Router.route('/story/:_storyid/:_userid', {
    name: 'story.show',

    path: '/story/:_storyid/:_userid',

    template: 'thestory',

    subscriptions: function() {
      this.subscribe('story');

    },
    data: function () {
      var data = Story.findOne({_id: this.params._storyid});
      if(data){

      } else {
        Router.go('nope');
      }
    },

    action: function () {
      // render all templates and regions for this route
      this.render();
      this.next();
    }
  });

  Template.thestory.onRendered(function () {
    $('#storyline').validate({
      rules: {
        storyline: {
          required: true,
        }
      },
      messages: {
        storyline: {
          required: "Please add your story line?"
        }
      },

      submitHandler: function () {
        event.preventDefault();
        var submitButton = $('input[type="submit"]').button('loading');

        var line = $('[name="storyline"]').val();
        Meteor.call('insertLine', line, function(err, resp){
          if(err){
            console.log(err)
          } else {
            Session.set('submit', 'yes');
          }
        })

        submitButton.button('reset');

      }
    });
  });

  Template.newstory.helpers({
    'info': function(){
      return Session.get('info');
    }

  });

  Template.newstory.onRendered(function () {
    $('#newstory').validate({

      submitHandler: function () {
        event.preventDefault();
        var submitButton = $('input[type="submit"]').button('loading');

        var number = $('[name="number"]').val();
        Meteor.call('createStory', number, function(err, info){
          if(err){
            console.log(err)
          } else {
            Session.set('info', info);
          }
        })

        submitButton.button('reset');

      }
    });
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.publish('story', function(){

    return Story.find({});


  });

Meteor.methods({
  'createStory': function(participants){
    var info = {
      id: '',
      invites: []
    };
    for(var i = 0; i < participants; i++){
      info.invites[i] =  Random.id();
    }
    info.id = Story.insert({invites: info.invites});

    return info;
  },
  'insertLine': function(line){
    Story.insert({line: line});
  },
  'removeInvite': function(invite){
    console.log(invite);
  }
})
}

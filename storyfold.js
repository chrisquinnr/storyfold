Story = new Meteor.Collection('story');

if (Meteor.isClient) {

  Meteor.subscribe('story');

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

  Router.route('/story/:storyid/:userid', {
    name: 'story.show',

    data: function () {
      var Story = Story.findOne({_id: this.params.storyid});
      var invites = Story.invites;

      var returnarr = invites.filter(function (elem, i, array) {
        if (elem === this.params.userid) {
          return true;
        }
      });

      if (returnarr === true){
        Meteor.call('removeInvite', this.params.userid);
        return data;
      } else {
        return false;
      }
    },


    action: function () {
      this.render('thestory');
    },
    onBeforeAction: function () {
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

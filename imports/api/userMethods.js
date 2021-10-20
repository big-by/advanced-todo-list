import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base';

Meteor.methods({
  'find_by_username'(username) {
    if(Accounts.findUserByUsername(username)){
      return true;
    }else{
      return false;
    }
  },

  'create_user'(username, password) {
    Accounts.createUser({
      username: username,
      password: password,
      profile: {
        nome: "",
        email: "",
        data: "",
        genero: "outro",
        empresa: "",
        avatar: "",
      },
    });
  },

  'add_profile_to_user'(profileData){
    const user = Meteor.users.findOne({_id: this.userId});

    if(user){
      Meteor.users.update({_id: this.userId}, {
        $set: { 
          profile: profileData,
        },
      })
    } else {
      throw new Meteor.Error();
    }
  },

})
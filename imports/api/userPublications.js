import { Meteor } from 'meteor/meteor';
import { TasksCollection } from '/imports/api/TasksCollection';


Meteor.publish('userData', function () {
  if (this.userId) {
    return Meteor.users.find({ _id: this.userId },
      {
        fields: { profile: 1}
      }
    );
  } else {
    this.ready();
  }
  
});
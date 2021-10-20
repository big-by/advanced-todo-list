import { Meteor } from 'meteor/meteor';
import { TasksCollection } from '/imports/api/TasksCollection';
import { Accounts } from 'meteor/accounts-base';
import '/imports/api/tasksMethods';
import '/imports/api/tasksPublications';
import '/imports/api/userMethods';
import '/imports/api/userPublications';

const SEED_USERNAME = 'samuel';
const SEED_PASSWORD = 'password';

Meteor.startup(() => {
   if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
  }

  TasksCollection._ensureIndex({title: 'text'});
});

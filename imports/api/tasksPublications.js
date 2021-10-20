import { Meteor } from 'meteor/meteor';
import { Tasks } from '../ui/Tasks';
import { TasksCollection } from '/imports/api/TasksCollection';


Meteor.publish('tasks', function publishTasks(filters, page) {
  if(!filters){
    filters = {}
  }
  return TasksCollection.find({
    $and: [
      filters,
      {
        $or: [
        {private: {$eq: false}},
        {private: {$eq: true}, userId: this.userId}
        ]
      },
    ]},
    {
      sort: {title: 1},
      limit: 4,
      skip: 4*(page-1)
    }
  );
});

Meteor.publish('tasks_dashboard', function publishTasks() {
  return TasksCollection.find(
      {
        $or: [
        { private: {$eq: false} },
        { private: {$eq: true}, userId: this.userId }
        ]
      }
  );
});

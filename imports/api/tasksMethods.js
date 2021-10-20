import { check } from 'meteor/check';
import { TasksCollection } from '/imports/api/TasksCollection';
import { Meteor } from 'meteor/meteor'

Meteor.methods({
  'tasks.insert'({title, description, date, situation, private}) {
    check(title, String);
    check(description, String);
    check(date, String);
    check(situation, String);
    check(private, Boolean);

    const user = Meteor.user()
    if (!this.userId) {
      throw new Meteor.Error('Não autorizado.');
    }

    TasksCollection.insert({
      title,
      description,
      date,
      situation,
      private,
      createdBy: user.profile.nome,
      userId: this.userId,
    });
  },

  'tasks.remove'(taskId) {
    check(taskId, String);
    if (!this.userId) {
      throw new Meteor.Error('Não autorizado.');
    }

    const task = TasksCollection.findOne({ _id: taskId, userId: this.userId});

    if(!task){
      throw new Meteor.Error('Não autorizado')
    } else {
      TasksCollection.remove(taskId);
    }    
  },

  'tasks.update'(taskId, {title, description, date, situation, private}) {
    check(taskId, String);
    check(title, String);
    check(description, String);
    check(date, String);
    check(situation, String);
    check(private, Boolean);

    const user = Meteor.user()
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const task = TasksCollection.findOne({ _id: taskId, userId: this.userId });
    
    if (!task) {
      throw new Meteor.Error('Acesso negado.');
    }

    TasksCollection.update(taskId, {
      $set: {
        title,
        description,
        date,
        situation,
        private,
        createdBy: user.profile.nome,
        userId: this.userId,
      },
    });
  },
  
})
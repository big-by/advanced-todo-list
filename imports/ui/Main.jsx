import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useHistory } from "react-router-dom";
import { useTracker } from 'meteor/react-meteor-data';
import { Typography, IconButton, Card, CardContent } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { TasksCollection } from '/imports/api/TasksCollection';

/*   Componente Main: Tela inicial/Dashboard
  State:
	Nenhum
  Funções:
    onViewTask: redireciona o usuário para lista de tarefas
 */

export const Main = () => {
    const history = useHistory();
    const taskFilter = [
        {situation: 'Cadastrada'},
        {situation: 'Em andamento'},
        {situation: 'Concluída'}
    ];

    const onViewTask = () => {
        history.push('/tasks');
    }

    /* Contagem de tarefas concluídas, em andamento e cadastradas */
    const tasksCount  = useTracker(() => {
        Meteor.subscribe('tasks_dashboard');
        return taskFilter.map((item) => {
            return TasksCollection.find(item).count();
        });
    });
    
    return (
        <div id="main-content">
            <Typography variant="h3" sx={{textAlign: 'center'}}>Bem vindo!</Typography>
            <Typography variant="h4" sx={{textAlign: 'center'}}>Quadro de Tarefas</Typography>
            <div className='tela-inicial'>
                {tasksCount.map((item, index) => (
                    <Card 
                        key={index}
                        variant="outlined"
                        sx={{
                        width: 175,
                        minHeight: 175,
                        m: 3,
                       
                    }}>
                        <CardContent>
                            <Typography 
                                variant="h6" 
                                component="div" 
                                sx={{textAlign: 'left'}}>
                                {taskFilter[index].situation}
                            </Typography>
                            <Typography
                                variant="h2" 
                                component="div" 
                                sx={{textAlign: 'center', fontWeight:'550'}}>
                                {item}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
                <Card 
                    variant="outlined"
                    sx={{
                    width: 175,
                    minHeight: 175,
                    m: 3,
                    }}>
                    <CardContent>
                        <Typography variant="h6" component="div" sx={{textAlign: 'left'}} >
                            Visualizar tarefas
                        </Typography>
                        <IconButton sx={{ml: '80px'}} onClick = {onViewTask}>
                            <ArrowForwardIcon fontSize="large"/>
                        </IconButton>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
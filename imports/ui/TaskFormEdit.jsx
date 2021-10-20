import React, {useEffect, useState} from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from "meteor/react-meteor-data";
import { TasksCollection } from '/imports/api/TasksCollection';
import { useHistory, useParams } from "react-router-dom";
import { 
   Button,
   TextField,
   Select,
   Typography,
   MenuItem,
   ButtonGroup,
   Checkbox,
   FormControlLabel,
   LinearProgress,
} from '@mui/material'
import ArrowBack from '@mui/icons-material/ArrowBack';

/*   Componente TaskFormEdit: Tela de edição de tarefas
  State:
   task: objeto que contém as informações da tarefa a ser editada
   disableEditWrongUser: ativa/desativa a opção de editar a tarefa 
                        caso o usuário for o dono da tarefa ou não
   editOption: habilita/desabilita os campos para edição
  Funções:
    useEffect: atualiza os campos da tarefa quando os dados são carregados
    handleChange: controla os valores dos campos
    handleCheckbox: controla o estado da checkbox de tarefa pública/privada
    handleUpdate: atualiza os dados da tarefa na base de dados
 */

export const TaskFormEditcomponent = ({ user, taskId, taskFromDB }) => {
   const history = useHistory();
   
   const [task, setTask] = useState({
      title:'', 
      description:'', 
      date:'', 
      situation:'Cadastrada',
      private:false,
      createdBy:''
   });
   const [disableEditWrongUser, setDisabled] = useState(true);
   const [editOption,setEdit] = useState(true);
   const options = ['Cadastrada', 'Em andamento', 'Concluída'];

   useEffect(() => {
      if(!user || !taskFromDB){
         return;
      }
      taskFromDB.userId === user._id? setDisabled(false) : setDisabled(true);
      setTask(taskFromDB)
   }, [user],[taskFromDB])
   
   const handleChange = (e) => {
      let {id, value, name} = e.target;
      if(!id){
         id = name;
      }
      setTask((prevState) => ({
         ...prevState,
         [id]:value
         })
      );
   }

   const handleCheckbox = (e) => {
      setTask((prevState) => (
         {...prevState, 
            private:e.target.checked
         })
      )
   }

   const handleUpdate = (e) => {
      e.preventDefault();

      Meteor.call('tasks.update', taskId, task);
      setEdit(false);
      setTask({
         title:'', 
         description:'', 
         date:'', 
         situation:'Cadastrada',
         private:false,
      })

      history.push('/tasks/');
   }
   
   const handleEdit = () => {
      setEdit(false);
   }
   
   if(!user || !taskFromDB){
      return (<LinearProgress />)
   }

   return(
      <div id="main-content">
         <Typography variant="h4" sx={{textAlign: 'center'}}>Tarefa</Typography>
      <header className="header-buttons">
         <Button variant="contained" onClick={() => history.push('/tasks/')}>
            <ArrowBack/>
         </Button>
         { editOption &&
         (<Button 
            disabled={disableEditWrongUser}
            variant="contained" 
            onClick={handleEdit}>
            EDIT
         </Button>)}
      </header>
      <form className="form-task">
         <FormControlLabel
            disabled={editOption}
            control={
            <Checkbox
               checked={task.private}
               onChange={handleCheckbox}
            />} 
            label="Marcar como tarefa privada" 
         />

         <TextField 
            id="author" 
            label="Criado por" 
            variant="filled"
            disabled={true}
            value={task.createdBy}
         />

         <TextField 
            id="title" 
            label="Título" 
            variant="filled"
            disabled={editOption}
            value={task.title}
            onChange={handleChange}
         />

         <TextField 
            id="description"
            label="Descrição"
            disabled={editOption}
            multiline
            maxRows={4}
            variant="filled"
            value={task.description}
            onChange={handleChange}
         />

         <TextField
            id="date"
            label="Data"
            disabled={editOption}
            type="date"
            variant="filled"
            value={task.date}
            onChange={handleChange}
            
            InputLabelProps={{
               shrink: true,
            }}
         />
         <Select
            labelId="situation"
            disabled={true}
            name="situation"
            variant="filled"
            value={task.situation}
            onChange={handleChange}>
            {options.map((option, index) => (
               <MenuItem key={index} value={option}>{option}</MenuItem>
               ))
            }
         </Select>
         
         <ButtonGroup
            fullWidth 
            disabled={disableEditWrongUser} 
            variant="outlined" 
            aria-label="outlined button group">
         <Button
            id="situation"
            value="Cadastrada" 
            onClick={handleChange}>
            Cadastrar
         </Button>
         <Button 
            id="situation"
            disabled={task.situation === 'Cadastrada' ? false : true} 
            value="Em andamento" 
            onClick={handleChange}>
            Em Andamento
         </Button>
         <Button
            id="situation"
            disabled={task.situation === 'Em andamento' ? false : true} 
            value="Concluída" 
            onClick={handleChange}>
            Concluir
         </Button>
         </ButtonGroup>
         <Button variant="contained" onClick={handleUpdate}>
            SAVE
         </Button>
      </form>
      </div>
   )
}

export const TaskFormEdit = withTracker(() => {
   let { taskId } = useParams();

   Meteor.subscribe('userData');
   const user = Meteor.user();
   
   Meteor.subscribe('tasks', { _id: taskId }, 1)
   const taskFromDB = TasksCollection.find().fetch()[0];

   return {user, taskId, taskFromDB};
})(TaskFormEditcomponent)
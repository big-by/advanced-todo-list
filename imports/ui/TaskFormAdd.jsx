import React, {useState, useEffect} from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from "meteor/react-meteor-data";
import { useHistory } from "react-router-dom";
import { 
   Button,
   TextField,
   Select,
   Typography,
   MenuItem,
   LinearProgress,
   FormControlLabel,
   Checkbox,
} from '@mui/material'
import ArrowBack from '@mui/icons-material/ArrowBack';

/*   Componente TaskFormAdd: Tela de adição de novas tarefas
  State:
   task: objeto com as informações da tarefa a ser criada
  Funções:
    useEffect: adiciona o nome do usuário ao campo "Criado por" 
               após o carregamento dos dados do usuario
    handleChange: controla os valores dos campos a serem preenchidos
    handleCheckbox: controla o estado da checkbox de tarefa pública/privada
    handleSubmit: salva a nova tarefa na base de dados
 */

export const TaskFormAddcomponent = ({ user }) => {
   const history = useHistory();
   const [task, setTask] = useState({
      title:'', 
      description:'', 
      date:'', 
      situation:'Cadastrada',
      private:false,
      createdBy:''
   });
   
   useEffect(() => {
      if(!user){
         return;
      } 
      user && setTask({...task, createdBy: user.profile.nome});
   }, [user])

   const options = ['Cadastrada', 'Em andamento', 'Concluída'];
   
   const handleChange = (e) => {
      let {id, value, name} = e.target;
      if(!id) {
         id = name;
      }
      setTask((prevState) => ({
         ...prevState,
         [id]:value
         })
      );
   }

   const handleCheckbox = (e) => {
      setTask((prevState) => ({
         ...prevState,
         private:e.target.checked
         })
      );
   }

   const handleSubmit = (e) => {
      e.preventDefault();

      Meteor.call('tasks.insert', task)
      setTask({
         title:'', 
         description:'', 
         date:'', 
         situation:'Cadastrada',
         private:false,
      });
      history.push('/tasks/');
   }

   if(!user || !user._id){
      return (<LinearProgress />)
   }

   return(
      <div id="main-content">
         <Typography variant="h4" sx={{textAlign: 'center'}}>Tarefa</Typography>
      <header className="header-buttons">
         <Button variant="contained" onClick={() => history.push('/tasks/')}>
            <ArrowBack/>
         </Button>
      </header>
      <form className="form-task">
         <FormControlLabel 
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
            value={task.title}
            onChange={handleChange}
         />
         <TextField 
            id="description"
            label="Descrição"
            multiline
            maxRows={4}
            variant="filled" 
            onChange={handleChange}
         />
         <TextField
            id="date"
            label="Data"
            type="date"
            variant="filled"
            value={task.date}
            onChange={handleChange}
            
            InputLabelProps={{
               shrink: true,
            }}/>
         <Select
            labelId="situation"
            name="situation"
            variant="filled"
            label="Situação"
            value={task.situation}
            onChange={handleChange}
         >
            {options.map((option, index) => (
               <MenuItem key={index} value={option}>{option}</MenuItem>
               ))
            }
         </Select>
         
         
         <Button variant="contained" onClick={handleSubmit}>
            ADD
         </Button>
      </form>
      </div>
   )
}

export const TaskFormAdd = withTracker(() => {
   const handler = Meteor.subscribe('userData');
   const user = Meteor.user();
   return {user};
})(TaskFormAddcomponent)
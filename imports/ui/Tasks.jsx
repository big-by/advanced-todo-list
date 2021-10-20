import { Meteor } from 'meteor/meteor';
import React, {useState} from 'react';
import { ReactiveVar } from 'meteor/reactive-var'
import { useHistory } from "react-router-dom";
import { Task } from './Task';
import { TasksCollection } from '/imports/api/TasksCollection';
import { useTracker } from 'meteor/react-meteor-data';
import { 
   Button, 
   Typography, 
   List, 
   LinearProgress, 
   InputAdornment,
   TextField,
   Pagination 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';

/*   Componente Tasks: Listagem das tarefas
  State:
   filterTasks: ativa/desativa o filtro de tarefas concluídas
   searchText: controla a busca por texto
   page: controla a página a ser exibida
  Funções:
    addTask: redireciona para a tela de nova tarefa
    deleteTask: deleta a tarefa selecionada chamando o método 'tasks.remove'
    viewTask: redireciona para a tela de visualização da tarefa
    handlePage: controla a paginação
 */

export const Tasks = () => {
   const history = useHistory();
   const user = useTracker(() => Meteor.user());
   const [filterTasks, setFilter] = useState(false);
   const [searchText, setSearch] = useState('');
   const [page, setPage] = useState(1);
   //let filterTasks = new ReactiveVar(false);
   
   const addTask = () => {
      history.push("/tasks/add")
   }

   const deleteTask = ({ _id }) => {
      Meteor.call('tasks.remove', _id);
   } 

   const viewTask = ({ _id }) => {
      history.push(`/tasks/view/${_id}`);
   }

   const handlePage = (event,value) => {
      setPage(value);
   }

   const filterTasksFunc = () => {
      return filterTasks.get()
   }

   const {tasks, isLoading, isEmpty} = useTracker(() => {
      const noDataAvailable = { tasks: [], isLoading: false, isEmpty: true};
      const filterText = searchText? {
            $text: { $search: `${searchText}`}
      } : {}
      const filterSit = filterTasks? {situation: 'Concluída'} : {}
      const filters = {...filterText, ...filterSit };
        
      const handler = Meteor.subscribe('tasks', filters, page);
      
      //isLoading: ativa tela de loading
      if (!handler.ready()) {
         return { ...noDataAvailable, isLoading: true, isEmpty: false};
      }
      
      const tasks = TasksCollection.find({}).fetch();
      
      //isEmpty: ativa a mensagem "Não há tarefas"
      if(TasksCollection.find({}).count() === 0){
         return { ...noDataAvailable, isLoading: false, isEmpty:true };
      }
      

      return { tasks };
   });

   return(
      <div id="main-content">
         <Typography variant="h4" sx={{textAlign:'center'}}>Tarefas</Typography>
         <header className="header-buttons">
            <Button 
            edge="start" 
            variant="contained" 
            onClick = {() => history.push('/main')}>
               <ArrowBackIcon/>
            </Button>
            <Button variant="contained" onClick={addTask}>Nova Tarefa</Button>
         </header>
         <div className="filters">
            <Button
               startIcon={<FilterAltIcon/>} 
               variant="outlined" 
               onClick={() => { setFilter(!filterTasks) }}>
                  {filterTasks? 'Todas' : 'Tarefas concluídas'}
            </Button>

            <TextField
               size="small"
               id="search"
               label="Pesquisa"
               onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
               }}
               InputProps={{
                  startAdornment: (
                  <InputAdornment position="start">
                     <SearchIcon />
                  </InputAdornment>
                  ),
               }}
            />
         </div>

         {
            isLoading && <LinearProgress sx={{margin: '10px 0px'}}/>
         }
         {!isEmpty? 
         (<div className="task-list">
            <List>
               {tasks.map((task) => (
                  <Task
                     key={task._id}
                     task={task}
                     user={user}
                     onDeleteTask={deleteTask}
                     onViewTask={viewTask}
                  />)
               )}
            </List>
         </div>
         ) : (
            <Typography variant="h6" sx={{textAlign:'center'}}>Não há tarefas.</Typography>
         )}

         <div className="paginas">
         <Pagination 
            color="primary"
            count={5}
            page={page}
            size="small" 
            sx={{justifyContent:'center'}}
            onChange={handlePage}
            />
         </div>
      </div>
   )
}

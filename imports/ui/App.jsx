import React, { useEffect } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from 'meteor/meteor'
import { Tasks } from './Tasks';
import { Header } from './Header';
import { Login } from './Login';
import { Main} from './Main';
import { TaskFormEdit } from './TaskFormEdit';
import { TaskFormAdd } from './TaskFormAdd';
import { Signup } from './Signup';
import { UserProfile } from "./UserProfile";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation,
  useHistory,
} from "react-router-dom";
import { Backdrop, CircularProgress } from "@mui/material";

/*  Componente App
  Componente principal
  Contém as rotas públicas e privadas (PrivateRoute)
*/
export const Appcomponent = ({ user }) => {
  let isLogged = user? true : false
  
  if(user === undefined){
    return (
      <>
        <Header />
        <Backdrop 
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}>
          <CircularProgress />
        </Backdrop></>
    )
  }
  return (
    <Router>
    <Header/>
      <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <PrivateRoute path="/main" component={Main} user={isLogged}/>
          <PrivateRoute path="/profile" component={UserProfile} user={isLogged} />
          <PrivateRoute path="/tasks" component={TaskEdit} user={isLogged} />
      </Switch>
    </Router>
  )
}

/*  Componente PrivateRoute: roteamento de caminhos privados
  Props:
    componente: componente a ser renderizado
    user: booleano que indica se existe um usuário logado
 */
const PrivateRoute = ({ component: Component, user, ...rest }) => {
  return(
    <Route
      {...rest}
      render={(routeProps) => (
        user ? ( <Component {...routeProps}/>
          ):(
          <Redirect to={{pathname:'/login'}}/>)
      )}
    />
  )
}

/*  Componente TaskEdit: contém as subrotas de /tasks/
  Props:
    match: url do componente que vai ser renderizado
 */

const TaskEdit = ({ match }) => {
  return (
    <Switch>
      <Route 
        exact path={`${match.path}`} 
        component={Tasks}
      />
      <Route path={`${match.path}/view/:taskId`}>
        <TaskFormEdit />
      </Route>
      <Route exact path={`${match.path}/add`}>
        <TaskFormAdd />
      </Route>
    </Switch>
  )
}

export const App = withTracker(() =>{
  const user = Meteor.user();
  

  return {user};
})(Appcomponent)

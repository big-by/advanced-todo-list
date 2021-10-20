import React, {useState} from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { useHistory } from "react-router-dom";
import ReorderIcon from '@mui/icons-material/Reorder';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { 
  AppBar, Button, Box,
  Toolbar, Typography, IconButton,
  Drawer, List, ListItem,
  ListItemAvatar, Avatar, ListItemText,
  Divider,
} from '@mui/material';

/*   Componente Header: Cabeçalho que aparece no topo de todas as páginas
  State:
    "open": estado do drawer aberto/fechado (true/false)
  Funções:
    "handleDrawerOpen": abre o drawer
    "handleDrawerClose": fecha o drawer
    "logout": realiza logout do usuário
 */
export const Header = () => {
  const [open, setOpen] = useState(false);
  const history = useHistory();
  
  const user = useTracker(() => {
    let userTemp = {
      profile:{ nome:'', email:'' } 
    }
    const handler = Meteor.subscribe('userData');
    if(!handler.ready()){
      return userTemp; //Inicializa com um usuário temporário
    } else {
      userTemp = Meteor.user();
      return userTemp;
    }
  });
  
  const handleDrawerOpen = () => {
    setOpen(true);
  }

  const handleDrawerClose = () => {
    setOpen(false);
  }

  const logout = () => {
    Meteor.logout();
    history.push('/');
  }

  return (
     <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {user && //Caso usuário não esteja logado, não é possível clicar no menu
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2}}
              
            onClick={handleDrawerOpen}
            onKeyDown={handleDrawerClose}>
            <ReorderIcon/>
          </IconButton>}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Advanced To-Do List
          </Typography>
          {user && 
            <Button 
              variant="contained" 
              color='error' 
              onClick={logout}>
                Logout
            </Button>}
        </Toolbar>
      </AppBar> 
      {user && <Drawer
        anchor="left"
        open={open}
        onClose={handleDrawerClose}> 
          <List sx={{width: '275px'}}>
            
            <ListItem sx={{backgroundColor:'primary.light'}}>
              <ListItemAvatar>
                <Avatar 
                  alt={user.profile.nome} 
                  src={user.profile.avatar} />
              </ListItemAvatar>
              <ListItemText
                  sx={{color:"black"}} 
                  primary={user.profile.nome}
                  secondary={user.profile.email} />
            </ListItem>
            <Divider/>

            <ListItem 
              button
              onClick={() => {
                history.push('/main');
                handleDrawerClose();}}>
              <IconButton>
                <HomeIcon />
              </IconButton>
              <ListItemText primary="Página Inicial" />
            </ListItem>
            <ListItem 
              button
              onClick={() => {
                history.push('/tasks');
                handleDrawerClose();}}>
              <IconButton>
                <EventNoteIcon />
              </IconButton>
              <ListItemText primary="Tarefas" />
            </ListItem>
            <ListItem 
              button
              onClick={() => {
                history.push('/profile');
                handleDrawerClose();
                }}>
              <IconButton>
                <PersonIcon />
              </IconButton>
              <ListItemText primary="Perfil" />
              </ListItem>

            <Divider/>
          </List>
      </Drawer>}
    </Box>
 );
}


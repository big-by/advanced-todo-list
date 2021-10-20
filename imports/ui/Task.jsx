import React, {useState} from 'react';
import {
    ListItem, 
    ListItemText,
    ListItemIcon,
    MenuItem,
    Avatar,
    IconButton,
    Typography,
    Menu
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ListAltIcon from '@mui/icons-material/ListAlt';

/*   Componente Task: Tela inicial/Dashboard
  Props:
    task: dados da tarefa a ser exibida
    onDeletetask: deletar a tarefa
    onViewTask: visualizar a tarefa
  State:
	anchor: âncora para o menu
  Funções:
    handleClick: indica o local que o menu irá abrir
    handleClose: fecha o menu da tarefa
 */

export const Task = ({ task, onDeleteTask, onViewTask }) => {
    const [anchor, setAnchor] = useState(null);
    const open = Boolean(anchor);
    
    const handleClick = (e) =>{
        setAnchor(e.currentTarget)
    };
    
    const handleClose = () => {
        setAnchor(null);
      };
    
    return (
        <ListItem
            button
            secondaryAction={
                <IconButton 
                    edge="end" 
                    aria-label="view"
                    aria-controls="basic-menu"
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}>
                    <MoreVertIcon color="primary" />
                </IconButton>}
        >
            <ListItemIcon>
                {/* <Avatar src="/imports/img/taskIcon.png" /> */}
                <ListAltIcon variant="square" color="primary" variant="filled"/>
            </ListItemIcon>
            <ListItemText 
                primary={task.title + (task.private? " **" : "")}
                secondary={task.createdBy}/>
            <Menu
                id="Menu"
                anchorEl={anchor}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                    }}>
                <MenuItem onClick={() => onViewTask(task)} disableRipple>
                    <VisibilityIcon/>Visualizar
                </MenuItem>
                <MenuItem onClick={() => onDeleteTask(task)} disableRipple >
                    <DeleteIcon/>Deletar
                </MenuItem>
            </Menu>
        </ListItem>
    )
}
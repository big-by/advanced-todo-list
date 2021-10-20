import React, {useEffect, useState} from 'react';
import { Meteor } from 'meteor/meteor'
import { useHistory } from "react-router-dom";
import {
	Box,
	Button,
	Typography,
	Input,
	TextField,
	FormHelperText,
	Alert
} from '@mui/material';

/*   Componente Login: Contém a página de login
  State:
	username: usuário inserido
	password: senha inserida
	alert: mensagens de alertar
  Funções:
    handleSubmit: realiza a tentativa de login
 */
export const Login = () =>{
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [alert, setAlert] = useState({state:false,message:''})
	let isLogged = false;
	const history = useHistory();
	if(isLogged){
		
	}
	const handleSubmit = (e) => {
		e.preventDefault();
		
		
		Meteor.loginWithPassword(username, password, function(error) {
			if(error){
				setAlert({state: true, message: `${error}`})
				isLogged = false;
				return;
			} else {
				isLogged = true;
			}
		});

		//Definitivamente não é a melhor forma de fazer isso
		Meteor.setTimeout(() => {
			if(isLogged){
				history.push('/main');
			}
		}, 800);
	}

   return (
		<Box
			sx={{
			bgcolor: '#FFF',
			boxShadow: 1,
			borderRadius: 1,
			m: '75px auto',
			p: '30px',
			borderTop: 8,
			borderColor: 'primary.main',
			maxWidth: '375px',
			minHeight: '300px',
		}}>
			<Typography variant="h5" component="div" 
				sx={{textAlign: 'center', paddingBottom:'40px'}} >
				Login
			</Typography>
			<div className="form-task">
			<TextField
				id="username"
				variant='filled'
				label="Username"
				placeholder="Username"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
			/>
			<TextField
				id="password"
				variant='filled'
				label="Password"
				type="password"
				placeholder="Password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				/>
			<Button variant="contained" onClick={handleSubmit}>LOGIN</Button>
			{alert.state && <Alert severity="error">{alert.message}</Alert>}
			<FormHelperText>
				<a href="/signup">Create Account</a>
			</FormHelperText>
			</div>
		</Box>
   )
}

import React, {useEffect, useState} from 'react';
import { Meteor } from 'meteor/meteor'
import { useHistory } from "react-router-dom";
import {
	Box,
	Button,
	Typography,
	TextField,
	FormHelperText,
	Alert
} from '@mui/material';
import { Redirect } from "react-router-dom";

/*   Componente Login: Contém a página de login
  State:
	username: usuário inserido
	password: senha inserida
	alert: mensagens de alertar
	isLogged: após o login, redireciona a pagina principal
  Funções:
    handleSubmit: realiza a tentativa de login
 */
export const Login = () =>{
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [alert, setAlert] = useState({state:false,message:''})
	const [isLogged, setLogged] = useState(false);
	const history = useHistory();
	
	
	const handleSubmit = (e) => {
		e.preventDefault();
		
		
		Meteor.loginWithPassword(username, password, function(error) {
			if(error){
				setAlert({state: true, message: `${error}`})
				
				return;
			} else {
				setLogged(true);
			}
		});
	}

	if(isLogged){
		return <Redirect to={{pathname:'/main'}} />;
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

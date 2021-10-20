import React, {useState} from 'react';
import { Meteor } from 'meteor/meteor';
import { Alert, Button, TextField, Typography } from '@mui/material';

/*   Componente SignUp: Contém a página para criar novos usuários
  State:
	username: usuário inserido
    password: senha inserida
    checkPassword: usado para conferir a senha digitada
	alert: mensagens de alerta
  Funções:
    createUser: criar o usuário na base de dados
 */
export const Signup = () => {
    const [username,setUser] = useState('');
    const [password,setPass] = useState('');
    const [checkPassword,setCheck] = useState('');
    const [alert, setAlert] = useState({state:false, type: 'error', message:''});

    const createUser = (e) => {
        e.preventDefault();
        Meteor.call('find_by_username', username, (error, checkUser) => {
            if(error){
                throw new Meteor.Error();
            } else {
                if(password !== checkPassword){
                    setAlert({state:true, type:'error', message:'As senhas não coincidem!'});
                    return;
                } else if(!password) {
                    setAlert({state:true, type:'error', message:'A senha não pode ser vazia!'});
                    return;
                } else {
                    if(!checkUser) {
                        Meteor.call('create_user', username, password, (error) => {
                            if(error){
                                throw new Meteor.Error()
                            } else {
                                setAlert({state:true,type:'success', message:'Usuário criado'});
                                return;
                            }
                        });
                    } else {
                        setAlert({state:true, type:'error', message:'O usuário já existe'});
                    }
                }
            }
        });
        setAlert({state:false, type:'error', message:''})
    }

    return (
        <div id="main-content">
        <Typography 
            variant="h4" 
            sx={{
                textAlign: 'center', 
                mb: '20px'
        }}>
            Crie sua conta
        </Typography>
        <form className="form-task">
            <TextField 
                id="username" 
                label="Usuário" 
                variant="filled"
                value={username}
                onChange={(e) => setUser(e.target.value)}
            />
            <TextField 
                id="password"
                type="password"
                label="Senha" 
                variant="filled"
                value={password}
                onChange={(e) => setPass(e.target.value)}
            />
            <TextField 
                id="retype"
                type="password"
                label="Repita a senha" 
                variant="filled"
                color={password === checkPassword? "success" : "error"}
                value={checkPassword}
                onChange={(e) => setCheck(e.target.value)}
            />
            <Button variant="contained" onClick={createUser}>CRIAR</Button>
            { alert.state && <Alert severity={alert.type}>{alert.message}</Alert>}
        </form>
        </div>
    );
}
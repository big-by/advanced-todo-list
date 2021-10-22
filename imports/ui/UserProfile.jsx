import React, { useEffect, useState} from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from "meteor/react-meteor-data";
import { useHistory} from "react-router-dom";
import { 
    TextField, 
    Input, 
    Button, 
    Alert,
    FormLabel,
    FormControlLabel,
    Radio,
    RadioGroup,
    Avatar,
    Stack,
    Skeleton
} from "@mui/material";
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';

/*   Componente UserProfile: Exibe os dados do usuário
  States:
   isUploaded: ativa alerta que o avatar foi carregado
   userdata: contém as informações do usuário
  Funções:
    handleChange: controla as informações inseridas
    handleImage: controla o upload do avatar
    handleSubmit: salva os dados do usuário na base de dados
    useEffect: atualiza userdata com os dados do usuário quando são carregados
 */

export const UserProfilecomponent = ({ user }) => {
    const history = useHistory();
    const [isUploaded, setUpload] = useState(false);
    const [userdata, setUserData] = useState({
        nome: "",
        email: "",
        data: "",
        genero: "outro",
        empresa: "",
        avatar: "",
    });
    
    useEffect(() => {
        if(!user){
            return;
        }
        setUserData(user.profile)
    }, [user])

    const handleChange = (e) => {
        let {id, value, name} = e.target;
        if(id === '') {
            id = name;
        }
        setUserData((prevState) => ({
            ...prevState,
            [id]:value,
            }
        ))
    }

    const handleImage = (e) => {
        let reader = new FileReader();
        let file = e.target.files[0];
    
        reader.readAsDataURL(file);
        reader.onload = (upload) => {
            setUserData((prevState) => ({
                ...prevState,
                avatar: upload.target.result,
                }
            ));
        };
        setUpload(true);
    }
    
    const handleSubmit = () => {
        Meteor.call('add_profile_to_user', userdata)
        history.push('/main');
        setUserData({
            nome: "",
            email: "",
            data: "",
            genero: "outro",
            empresa: "",
            avatar: "",
        });
    }

    //Renderiza um esqueleto enquanto as informações do usuário carregam
    if(!user || !user._id){
        return (
            <div id="main-content">
            <Stack spacing={1} style={{justifyContent:'center', alignItems:"center"}}>
                <Skeleton variant="circular" width={100} height={100} />
                <Skeleton variant="rectangular" width="90%" height={400} />
            </Stack>
            </div>

        );
    }

    return (
        <div id="main-content">
        <form className="form-task">
            <div className="avatar-buttons">
                <Avatar
                    className="grid1"
                    sx={{margin:'auto', width:'100px', height: '100px'}} 
                    alt={userdata.nome} 
                    src={userdata.avatar} />
                <label htmlFor="avatar">
                <Input 
                    style={{display:'none'}} 
                    accept="image/*" 
                    id="avatar" 
                    multiple
                    onChange={handleImage}
                    type="file" />
                <Button
                    className="grid2"
                    variant="contained"
                    size="small"
                    startIcon={<PhotoCamera/>}
                    component="span">
                    Upload
                </Button></label>
                
                <Button
                    className="grid3"
                    variant="contained"
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon/>}
                    onClick={() => { setUserData({ ...userdata, avatar: ""})}}
                    component="span">
                    Remover
                </Button>
            </div>
            
            {isUploaded && <Alert severity="success">Arquivo enviado</Alert>}
            
            <TextField 
                id="nome" 
                label="Usuário" 
                variant="filled"
                value={userdata.nome}
                onChange={handleChange}
            />
            <TextField 
                id="email" 
                label="E-mail" 
                variant="filled"
                value={userdata.email}
                onChange={handleChange}
            />
            <TextField 
                id="data" 
                label="Data de Nascimento" 
                variant="filled"
                type="date"
                value={userdata.data}
                onChange={handleChange}
                InputLabelProps={{
                    shrink: true,
                 }}
            />
            <TextField 
                id="empresa" 
                label="Empresa" 
                variant="filled"
                value={userdata.empresa}
                onChange={handleChange}
            />
            <FormLabel component="legend">Gênero</FormLabel>
            <RadioGroup
                row
                value={userdata.genero}
                onChange={handleChange}
                name="genero">
                <FormControlLabel value="feminino" control={<Radio />} label="Feminino" />
                <FormControlLabel value="masculino" control={<Radio />} label="Masculino" />
                <FormControlLabel value="outro" control={<Radio />} label="Outro" />
            </RadioGroup>
            <Button onClick={handleSubmit} variant="contained">SAVE</Button>
        </form>  
        </div>
    )
};


export const UserProfile = withTracker(() => {
    const handler = Meteor.subscribe('userData');
    const user = Meteor.user();
    return {user};
})(UserProfilecomponent)

import React from 'react'
import { 
    Grid,
    TextField,
    FormControlLabel,
    Checkbox
} from "@material-ui/core";
import {
    RegularCard,
    Button,
    ItemGrid
} from './../components';
import './CrearUsuario.css'
import axios from 'axios'
import toastr from 'toastr'
import { SAVE_USER, ONE_USER } from './../routing'
import { UNEXPECTED } from './../dictionary'

class Crear extends React.Component {
    state = { 
        name : '', 
        id : null, 
        errorMessage : '',
        productos : false,
        marcas : false,
        lineas : false,
        inventario : false,
        usuarios : false,
        notificaciones_inventario : false,
        ventas : false
    }

    constructor(props){
        super(props)

        this.goList = this.goList.bind(this)
        this.onChange = this.onChange.bind(this)
        this.save = this.save.bind(this)

        if(this.props.history.location.state){
            this.state.id = this.props.history.location.state.id
        }
    }

    componentDidMount(){
        if(this.state.id > 0){
            axios.post(ONE_USER, { id : this.state.id })
            .then((r) => {
                this.setState({
                    name : r.data.nombre,
                    user : r.data.user,
                    productos : r.data.productos == 1,
                    lineas : r.data.lineas == 1,
                    marcas : r.data.marcas == 1,
                    inventario : r.data.inventario == 1,
                    ventas : r.data.ventas == 1,
                    usuarios : r.data.usuarios == 1,
                    notificaciones_inventario : r.data.notificaciones_inventario == 1
                })
            })
        }
    }

    onChange(e){
        this.setState({
            id : this.state.id,
            name : e.target.value
        })
    }

    goList(){
        this.props.history.push({
            pathname: '/usuarios',
        })
    }

    save(e){
        e.preventDefault()
        if(this.state.name !== ''){
            axios.post(SAVE_USER, this.state)
            .then((r) => {
                if(r.data.status === 200){
                    toastr.success(`Agregada con éxito`)
                    this.goList()
                }else if(r.data.message){
                    toastr.error(r.data.message)
                    this.setState({
                        errorMessage : r.data.message
                    })
                }else{
                    toastr.error(UNEXPECTED)
                }
            })
        }else{
            toastr.error('El nombre no puede ser vacio')
        }
    }

    handleChange = name => event => {
        this.setState({
            [name]: ['name', 'user', 'password'].indexOf(name) === -1
                ? !this.state[name]
                : event.target.value
        });
    }

    render(){
        const { errorMessage, productos, marcas, lineas } = this.state

        return ( 
            <div className="create-line">
                <Grid container>
                    <ItemGrid xs={12} sm={12} md={8}>
                        <RegularCard
                            cardTitle="Crear Usuario"
                            cardSubtitle="Completa la información"
                            headerColor='blue'
                            classes={{
                                cardHeader : 'RegularCard-cardTitle-101'
                            }}
                            content={
                                <div>
                                    <Grid container spacing={24}>
                                        <Grid item xs={12} sm={12} md={6}>
                                            <TextField
                                                id="name"
                                                label="Nombre"
                                                fullWidth
                                                error={errorMessage !== ''}
                                                helperText={errorMessage}
                                                value={this.state.name}
                                                onChange={this.handleChange('name')}
                                                InputProps={{
                                                    autoComplete : 'off'
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={6}>
                                            <TextField
                                                label="Usuario"
                                                fullWidth
                                                value={this.state.user}
                                                onChange={this.handleChange('user')}
                                                InputProps={{
                                                    readOnly : this.state.id > 0,
                                                    autoComplete : 'off'
                                                }}
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={6}>
                                            <TextField
                                                label="Contraseña"
                                                fullWidth
                                                value={this.state.password}
                                                onChange={this.handleChange('password')}
                                                InputProps={{
                                                    autoComplete : 'off'
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={6}>
                                            <TextField
                                                label="Repetir Contraseña"
                                                fullWidth
                                                value={this.state.password2}
                                                onChange={this.onChange}
                                                InputProps={{
                                                    autoComplete : 'off'
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={6}>
                                            Modulos
                                            <br/>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        name="productos"
                                                        checked={productos}
                                                        onChange={this.handleChange('productos')}
                                                        value="1"
                                                    />
                                                }
                                                label="Productos"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        name="lineas"
                                                        checked={lineas}
                                                        onChange={this.handleChange('lineas')}
                                                        value="1"
                                                    />
                                                }
                                                label="Lineas"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        name="marcas"
                                                        checked={marcas}
                                                        onChange={this.handleChange('marcas')}
                                                        value="1"
                                                    />
                                                }
                                                label="Marcas"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        name="inventario"
                                                        checked={this.state.inventario}
                                                        onChange={this.handleChange('inventario')}
                                                        value="1"
                                                    />
                                                }
                                                label="Inventario"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        name="ventas"
                                                        checked={this.state.ventas}
                                                        onChange={this.handleChange('ventas')}
                                                        value="1"
                                                    />
                                                }
                                                label="Ventas"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        name="usuarios"
                                                        checked={this.state.usuarios}
                                                        onChange={this.handleChange('usuarios')}
                                                        value="1"
                                                    />
                                                }
                                                label="Usuarios"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        name="notificaciones_inventario"
                                                        checked={this.state.notificaciones_inventario}
                                                        onChange={this.handleChange('notificaciones_inventario')}
                                                        value="1"
                                                    />
                                                }
                                                label="Notificaciones Inventario"
                                            />
                                        </Grid>
                                    </Grid>
                                </div>
                            }
                            footer={
                                <div>
                                    <Button color="simple" classes={{ button: 'text-body' }} onClick={this.goList}>
                                        <i className="fa fa-arrow-left"></i>&nbsp;&nbsp;Regresar
                                    </Button>
                                    <Button color="success" onClick={this.save} disabled={this.state.name === ''}>
                                        { this.state.id !== null ? 'Guardar' : 'Crear' }
                                    </Button>
                                </div>
                            }
                        />
                    </ItemGrid>
                </Grid>
            </div>
        )
    }
}

export default Crear
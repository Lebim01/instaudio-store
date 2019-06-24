import React from 'react'
import { Grid } from "material-ui";

import {
    RegularCard,
    Button,
    ItemGrid
} from './../components';
import TextField from 'material-ui/TextField';
import './CrearClientes.css'
import axios from 'axios'
import toastr from 'toastr'
import { SAVE_CLIENTS, ONE_CLIENTS } from './../routing'
import { UNEXPECTED } from './../dictionary'

class Crear extends React.Component {
    state = { name : '', email : '', id : null }
    constructor(props){
        super(props)

        this.onChange = this.onChange.bind(this)
        this.save = this.save.bind(this)

        if(this.props.history.location.state){
            this.state.id = this.props.history.location.state.id
        }
    }

    componentDidMount(){
        if(this.state.id > 0){
            axios.post(ONE_CLIENTS, { id : this.state.id })
            .then((r) => {
                this.setState({
                    name : r.data.nombre,
                    email : r.data.email
                })
            })
        }
    }

    onChange(e, name){
        this.setState({
            [name] : e.target.value,
        })
    }

    goList(){
        window.location = '/clientes'
    }

    save(e){
        e.preventDefault()
        if(this.state.name !== '' || this.state.email){
            axios.post(SAVE_CLIENTS, { name : this.state.name, email : this.state.email, id : this.state.id })
            .then((r) => {
                if(r.data.status === 200){
                    toastr.success(`Agregado con éxito`)
                    this.goList()
                }else if(r.data.message){
                    toastr.error(r.data.message)
                }else{
                    toastr.error(UNEXPECTED)
                }
            })
        }else{
            toastr.error('El nombre/email no puede ser vacio')
        }
    }

    render(){
        return ( 
            <div className="create-line">
                <Grid container>
                    <ItemGrid xs={12} sm={12} md={8}>
                        <RegularCard
                            cardTitle="Crear Cliente"
                            cardSubtitle="Completa la información"
                            headerColor='red'
                            classes={{
                                cardHeader : 'RegularCard-cardTitle-101'
                            }}
                            content={
                                <div>
                                    <Grid container>
                                        <ItemGrid xs={12} sm={12} md={6}>
                                            <TextField
                                                id="name"
                                                label="Nombre"
                                                fullWidth
                                                value={this.state.name}
                                                onChange={(e) => this.onChange(e, 'name')}
                                            />
                                        </ItemGrid>
                                        <ItemGrid xs={12} sm={12} md={6}>
                                            <TextField
                                                id="email"
                                                label="Email"
                                                fullWidth
                                                value={this.state.email}
                                                onChange={(e) => this.onChange(e, 'email')}
                                            />
                                        </ItemGrid>
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
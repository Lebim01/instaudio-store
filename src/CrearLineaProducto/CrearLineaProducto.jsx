import React from 'react'
import { Grid } from "material-ui";

import {
    RegularCard,
    Button,
    ItemGrid
} from './../components';
import './CrearLineaProducto.css'
import axios from 'axios'
import toastr from 'toastr'
import { SAVE_LINEAS, ONE_LINEAS } from './../routing'
import { UNEXPECTED } from './../dictionary'
import { TextField } from '@material-ui/core';
import { MenuItemLink } from 'react-admin';

class Crear extends React.Component {
    state = { name : '', id : null, errorMessage : '' }
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
            axios.post(ONE_LINEAS, { id : this.state.id })
            .then((r) => {
                this.setState({
                    name : r.data.nombre
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
        window.location.href = '/#/lineasproductos'
    }

    save(e){
        e.preventDefault()
        if(this.state.name !== ''){
            axios.post(SAVE_LINEAS, { name : this.state.name, id : this.state.id })
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

    render(){
        const { errorMessage } = this.state
        return ( 
            <div className="create-line">
                <Grid container>
                    <ItemGrid xs={12} sm={12} md={8}>
                        <RegularCard
                            cardTitle="Crear Linea de Producto"
                            cardSubtitle="Completa la información"
                            headerColor='blue'
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
                                                onChange={this.onChange}
                                                value={this.state.name}
                                                error={errorMessage !== ''}
                                                helperText={errorMessage}
                                            />
                                        </ItemGrid>
                                    </Grid>
                                </div>
                            }
                            footer={
                                <div>
                                    <MenuItemLink to="/marcas" leftIcon={<i className="fa fa-arrow-left"></i>} primaryText="Regresar" className="inline-block" />
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
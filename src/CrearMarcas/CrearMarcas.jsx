import React from 'react'
import { Grid } from "material-ui";

import {
    RegularCard,
    Button,
    ItemGrid
} from './../components';
import './CrearMarcas.css'
import TextField from 'material-ui/TextField';
import axios from 'axios'
import toastr from 'toastr'
import { SAVE_MARCAS, ONE_MARCAS } from './../routing'
import { UNEXPECTED } from './../dictionary'
import { MenuItemLink } from 'react-admin';

class Crear extends React.Component {
    state = { 
        name : '', 
        id : null, 
        errorMessage : '',
        pictures : [],
        pictures64 : '',
        banners : [],
        banner64 : ''
    }

    constructor(props){
        super(props)

        this.onChange = this.onChange.bind(this)
        this.save = this.save.bind(this)
        this.onDrop = this.onDrop.bind(this)
        this.onDropBanner = this.onDropBanner.bind(this)

        if(this.props.history.location.state){
            this.state.id = this.props.history.location.state.id
        }
    }

    componentDidMount(){
        if(this.state.id > 0){
            axios.post(ONE_MARCAS, { id : this.state.id })
            .then((r) => {
                this.setState({
                    name : r.data.nombre,
                    pictures64 : r.data.image,
                    banner64 : r.data.banner
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
        window.location = '/marcas'
    }

    save(e){
        e.preventDefault()
        if(this.state.name !== ''){
            axios.post(SAVE_MARCAS, { name : this.state.name, id : this.state.id, image : this.state.pictures.length > 0 ? this.state.pictures64 : '', banner : this.state.banners.length > 0 ? this.state.banner64 : '' })
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

    getBase64(file) {
        return new Promise((resolve) => {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                console.log(reader.result);
                resolve(reader.result)
            };
            reader.onerror = function (error) {
                console.log('Error: ', error);
                resolve()
            };
        })
     }

    async onDrop(picture) {
        this.setState({
            pictures: this.state.pictures.concat(picture),
            pictures64: await this.getBase64(picture[picture.length-1])
        });        
    }

    async onDropBanner(picture) {
        this.setState({
            banners: this.state.banners.concat(picture),
            banner64: await this.getBase64(picture[picture.length-1])
        });        
    }

    render(){
        const { errorMessage } = this.state
        return ( 
            <div className="create-line">
                <Grid container>
                    <ItemGrid xs={12} sm={12} md={8}>
                        <RegularCard
                            cardTitle="Crear Marca"
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
                                                error={errorMessage !== ''}
                                                helperText={errorMessage}
                                                value={this.state.name}
                                                onChange={this.onChange}
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
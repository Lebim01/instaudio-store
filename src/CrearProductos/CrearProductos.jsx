import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import green from 'material-ui/colors/green';
import classNames from 'classnames';
import './CrearProductos.css'
import Loader from 'react-loader'
import moment from 'moment'

// COMPONENTES
import Tabs, { Tab } from 'material-ui/Tabs';
import {
    AppBar,
    Badge,
    Button,
} from 'material-ui'
import SwipeableViews from 'react-swipeable-views';
import Fotos from './Fotos'
import InformacionBasica from './InformacionBasica'

// ICONS
import ErrorIcon from '@material-ui/icons/Error';
import AddIcon from '@material-ui/icons/Save';

// REQUEST
import axios from 'axios'
import { SAVE_PRODUCTS, ONE_PRODUCTS, UP_PHOTOS_PRODUCTS } from './../routing'
import { UNEXPECTED } from './../dictionary'
import toastr from 'toastr'

function TabContainer(props) {
    const { children, dir } = props;
    return (
        <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
            {children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
    dir: PropTypes.string.isRequired,
};

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: '100%',
        position: 'relative',
        minHeight: 200,
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)'
    },
    fab: {
        position: 'absolute',
        top: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2,
    },
    fabGreen: {
        color: theme.palette.common.white,
        backgroundColor: green[500],
    },
    row : {
        paddingTop : 10,
        paddingBottom : 10,
        marginTop : 5
    },
    textField: {
        width : '100%',
        textAlign : 'left'
    },
    formControl : {
        width : '100%'
    },
    paper: {
        padding: theme.spacing.unit
    },
    checkbox: {
        marginBottom: 16,
    },
    checkboxLabel : {
        color : theme.palette.accent.contrastText,
    },
    padding: {
        padding: `0 ${theme.spacing.unit * 2}px`,
    },
});

class CrearProductos extends React.Component {
    state = {
        indexTab: 0,
        validStep1 : false,
        validStep2 : false,
        photos : [],
        photos_saved : [],
        palabrasclave : [],
        nombre : '',
        codigo : '',
        descripcion : '',
        linea : 0,
        marca : 0,
        cantidad_unidades: 0,
        maximo_inventario : 0,
        minimo_inventario : 0,
        id : null,
        loading : true,
        isBox : false,
        errorMessage : ''
    };

    constructor(props){
        super(props)

        this.boolValidStep1 = this.boolValidStep1.bind(this)
        if(props.history.location.state){
            this.state.id = props.history.location.state.id
        }
    }

    componentDidMount(){
        if(this.state.id !== null){
            axios.post(ONE_PRODUCTS, { id : this.state.id })
            .then((r) => {
                if(r.data){
                    this.setState({
                        nombre : r.data.nombre,
                        descripcion : r.data.descripcion,
                        linea : r.data.id_linea,
                        marca : r.data.id_marca,
                        codigo : r.data.codigo,
                        photos_saved : r.data.photos,
                        palabrasclave : r.data.palabrasclave,
                        isBox : r.data.isBox == 1,
                        cantidad_unidades : r.data.cantidad_unidades,
                        isPromocion : r.data.isPromocion == 1,
                        promocion_desde : r.data.promocion_desde,
                        promocion_hasta : r.data.promocion_hasta,
                        promocion_tipo_descuento : r.data.promocion_tipo_descuento,
                        promocion_descuento : r.data.promocion_descuento,
                        minimo_inventario : r.data.minimo_inventario,
                        maximo_inventario : r.data.maximo_inventario,
                        validStep2 : true,
                        loading : false
                    }, ()=> {
                        this.setState({
                            validStep1 : this.boolValidStep1()
                        })
                    })
                }
            })
        }else{
            this.setState({
                loading : false
            })
        }
    }

    handleChange = (event, value) => {
        this.setState({ indexTab : value });
    };

    handleChangeIndex = index => {
        this.setState({ indexTab: index });
    };

    changeStep1(state){
        this.setState({
            ...state
        }, () => {
            this.setState({
                validStep1 : this.boolValidStep1()
            })
        })
    }

    boolValidStep1(){
        let { nombre, promocion_desde, promocion_hasta, nuevo_desde, nuevo_hasta, isNuevo, isPromocion } = this.state
        let valid = true

        if(!(nombre !== '')) valid = false
        if(isNuevo) if(!moment(nuevo_desde).isBefore(nuevo_hasta)) valid = false
        if(isPromocion) if(!moment(promocion_desde).isBefore(promocion_hasta)) valid = false

        return valid
    }

    onChangePhotosSaved(photos_saved){
        this.setState({
            photos_saved : photos_saved,
            validStep2 : photos_saved.length > 0 || this.state.photos.length > 0
        })
    }

    changeStep2(photos){
        this.setState({
            photos,
            validStep2 : photos.length > 0 || this.state.photos_saved.length > 0
        }) 
    }

    uploadImages(images, id_producto){
        const saveImage = function(filename, data, id_producto){
            return new Promise((resolve) => {
                const params = { id_producto, data, filename }
                axios.post(UP_PHOTOS_PRODUCTS, params)
                .then((r) => {
                    if(r.message){
                        toastr.error(r.message)
                    }
                    resolve()
                })
            })
        }
        
        const self = this
        return new Promise(async (resolve) => {
            for (let i = 0; i < images.length; i++){
                let data = await self.getDataImage(images[i])
                await saveImage(images[i].filename, data, id_producto)
            }
            resolve()
        })
    }

    getDataImage(image){
        return new Promise((resolve) => {
            let fileReader = new FileReader();
            fileReader.onload = function(fileLoadedEvent) {
                let data = fileLoadedEvent.target.result
                resolve(data)
            }
            fileReader.readAsDataURL(image);
        })
    }

    saveProduct(e){
        this.setState({loading : true})
        e.preventDefault()
        if(this.state.validStep1 && this.state.validStep2){
            const params = {
                nombre : this.state.nombre,
                descripcion : this.state.descripcion,
                linea : this.state.linea,
                marca : this.state.marca,
                id : this.state.id,
                codigo : this.state.codigo,
                palabrasclave : this.state.palabrasclave,
                isBox : this.state.isBox,
                cantidad_unidades : this.state.cantidad_unidades,
                isPromocion : this.state.isPromocion,
                promocion_desde : this.state.promocion_desde,
                promocion_hasta : this.state.promocion_hasta,
                promocion_tipo_descuento : this.state.promocion_tipo_descuento,
                promocion_descuento : this.state.promocion_descuento,
                maximo_inventario : this.state.maximo_inventario,
                minimo_inventario : this.state.minimo_inventario
            },
            headers = { headers: {'Content-Type': 'application/json;charset=UTF-8'} }
            axios.post(SAVE_PRODUCTS, params, headers)
            .then(async (r) => {
                if(r.data.status === 200){
                    let id_producto = r.data.id_producto
                    await this.uploadImages(this.state.photos, id_producto)
                    toastr.success(`Producto creado correctamente`)
                    window.location.href = '/#/productos'
                }else if(r.data.message){
                    toastr.error(r.data.message)
                    this.setState({
                        errorMessage : r.data.message,
                        loading : false
                    })
                }else{
                    toastr.error(UNEXPECTED)
                }
            })
            .catch(() => {
                toastr.error(UNEXPECTED)
            })
        }else{
            toastr.error(`Favor de llenar toda la información`)
        }
    }

    render() {
        const { classes, theme } = this.props;
        const { validStep1, validStep2, nombre, descripcion, codigo, linea, marca, photos, photos_saved, palabrasclave, isBox, cantidad_unidades, loading, errorMessage } = this.state
        const { isPromocion, promocion_desde, promocion_hasta, promocion_tipo_descuento, promocion_descuento } = this.state
        const { minimo_inventario, maximo_inventario } = this.state
        
        return (
            <div className={classes.root}>
                <Loader loaded={!loading} lines={13} length={20} width={10} radius={30}
                    corners={1} rotate={0} direction={1} color="#000" speed={1}
                    trail={60} shadow={false} hwaccel={false} className="spinner"
                    zIndex={2e9} top="50%" left="50%" scale={1.00}
                    loadedClassName="loadedContent" />

                <AppBar position="static" color="default">
                    <Tabs
                        value={this.state.indexTab}
                        onChange={this.handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        fullWidth
                        centered
                    >
                        <Tab 
                            label={
                                <div>
                                    { !validStep1 && (
                                        <Badge className={classes.padding} color="secondary" badgeContent={<ErrorIcon/>}>
                                            Información Basica
                                        </Badge>
                                    ) }
                                    { validStep1 && (
                                        "Información Basica"
                                    ) }
                                </div>
                            } 
                        />
                        <Tab label={
                                <div>
                                    { !validStep2 && (
                                        <Badge className={classes.padding} color="secondary" badgeContent={<ErrorIcon/>}>
                                            Imagenes
                                        </Badge>
                                    ) }
                                    { validStep2 && (
                                        "Imagenes"
                                    ) }
                                </div>
                            }  
                        />
                    </Tabs>
                </AppBar>
                <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={this.state.indexTab}
                    onChangeIndex={this.handleChangeIndex}
                >
                    <TabContainer dir={theme.direction}>
                        <InformacionBasica 
                            onChange={this.changeStep1.bind(this)}
                            {...{nombre, descripcion, linea, marca, codigo, palabrasclave, isBox, cantidad_unidades, errorMessage, isPromocion, promocion_desde, promocion_hasta, promocion_tipo_descuento, promocion_descuento, minimo_inventario, maximo_inventario}} />
                    </TabContainer>
                    <TabContainer dir={theme.direction}>
                        <Fotos 
                            onChangePhotos={this.changeStep2.bind(this)}
                            photos={photos}
                            photos_saved={photos_saved}
                            onChangePhotosSaved={this.onChangePhotosSaved.bind(this)}
                        />
                    </TabContainer>
                </SwipeableViews>
                { (validStep1 && validStep2) &&
                    <Button 
                        variant="fab" 
                        className={classNames(classes.fab, classes.fabGreen)} 
                        color={'inherit'}
                        onClick={this.saveProduct.bind(this)}>
                        <AddIcon />
                    </Button>
                }
            </div>
        );
    }
}

CrearProductos.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(CrearProductos);
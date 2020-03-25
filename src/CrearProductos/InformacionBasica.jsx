import React from 'react'
import axios from 'axios'
import {LIST_LINEAS, LIST_MARCAS} from 'routing'
import green from 'material-ui/colors/green';
import moment from 'moment'
import { withStyles } from '@material-ui/core/styles';
import {
    Select,
    Grid,
    FormControl,
    TextField,
    InputLabel,
    Chip,
    InputAdornment,
    FormControlLabel,
    Checkbox
} from 'material-ui'

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: '100%',
        position: 'relative',
        minHeight: 200
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
    chip: {
        margin: theme.spacing.unit / 2,
    },
});

class InformacionBasica extends React.Component {
    state = {
        linea : '',
        marca : '',
        nombre : '',
        descripcion : '',
        codigo : '',
        codigo_producto: '',
        cantidad_unidades : 0,
        lineas : [],
        marcas : [],
        palabrasclave : [],
        isBox : false,
        isPromocion : false,
        promocion_desde : '',
        promocion_hasta : '',
        promocion_limite : 0,
        promocion_tipo_descuento : 'Porcentaje',
        promocion_descuento : 0,
        minimo_inventario : 0,
        maximo_inventario : 0
    }

    constructor(props){
        super(props)
        this.updateEstado = this.updateEstado.bind(this)
    }

    componentDidMount(){
        axios.post(LIST_LINEAS)
        .then((r_lineas) => {
            axios.post(LIST_MARCAS)
            .then((r_marcas) => {
                this.setState({
                    marcas : r_marcas.data,
                    lineas : r_lineas.data
                })
            })
        })
    }

    componentWillReceiveProps(props){
        this.setState({
            linea : props.linea,
            marca : props.marca,
            nombre : props.nombre,
            descripcion : props.descripcion,
            codigo : props.codigo,
            codigo_producto: props.codigo_producto,
            isBox : props.isBox,
            palabrasclave : props.palabrasclave,
            errorMessage : props.errorMessage,
            cantidad_unidades : props.cantidad_unidades,
            isPromocion : props.isPromocion,
            promocion_desde : props.promocion_desde,
            promocion_hasta : props.promocion_hasta,
            promocion_descuento : props.promocion_descuento,
            promocion_limite : props.promocion_limite,
            promocion_tipo_descuento : props.promocion_tipo_descuento,
            minimo_inventario : props.minimo_inventario,
            maximo_inventario : props.maximo_inventario,
        })
    }

    handleChange = name => event => {
        this.setState({
            [name]: name === 'isNuevo' || name === 'isPromocion' || name === 'isBox'
                ? !this.state[name] 
                : event.target.value
        }, () => {
            this.updateEstado()
        });
    }

    updateEstado = () => {
        if(this.props.onChange){
            let estado = { 
                nombre : this.state.nombre,
                descripcion : this.state.descripcion,
                linea : this.state.linea,
                marca : this.state.marca,
                codigo : this.state.codigo,
                codigo_producto : this.state.codigo_producto,
                isBox : this.state.isBox,
                palabrasclave : this.state.palabrasclave,
                cantidad_unidades : this.state.cantidad_unidades,
                promocion_descuento : this.state.promocion_descuento,
                isPromocion : this.state.isPromocion,
                promocion_desde : this.state.promocion_desde,
                promocion_hasta : this.state.promocion_hasta,
                promocion_limite : this.state.promocion_limite,
                promocion_tipo_descuento : this.state.promocion_tipo_descuento,
                maximo_inventario : this.state.maximo_inventario,
                minimo_inventario : this.state.minimo_inventario
            }
            this.props.onChange(estado)
        }
    }

    onKeyPress = (ev) => {
        if (ev.key === 'Enter') {
            if(this.state._palabraclave){
                let _palabras = this.state.palabrasclave
                _palabras.push({
                    key : _palabras.length,
                    label : this.state._palabraclave
                })
                this.setState({
                    palabrasclave : _palabras,
                    _palabraclave : ''
                }, () => {
                    this.updateEstado()
                })
            }
        }
    }

    handleDelete = (data) => {
        let _palabras = this.state.palabrasclave
        _palabras = _palabras.filter((r) => r.label !== data.label)
        this.setState({
            palabrasclave : _palabras
        }, () => {
            this.updateEstado()
        })
    }

    render(){
        const { errorMessage, nombre, descripcion, linea, marca, palabrasclave, _palabraclave, codigo, codigo_producto, isBox, cantidad_unidades, isPromocion, promocion_desde, promocion_hasta, promocion_descuento, promocion_tipo_descuento } = this.state
        const { minimo_inventario, maximo_inventario } = this.state
        const { classes } = this.props
        return (
            <div className={styles.root}>
                <Grid container spacing={24} className={styles.row}>
                    <Grid item xs={12} md={4} className={styles.paper}>
                        <TextField
                            label="Nombre"
                            className={styles.textField}
                            value={nombre}
                            onChange={this.handleChange('nombre')}
                            fullWidth
                            error={errorMessage !== ''}
                            helperText={errorMessage}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4} className={styles.paper}>
                        <TextField
                            label="Descripción"
                            className={styles.textField}
                            value={descripcion}
                            onChange={this.handleChange('descripcion')}
                            fullWidth
                            error={errorMessage !== ''}
                            helperText={errorMessage}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4} className={styles.paper}>
                        <TextField 
                            label="Mínimo inventario"
                            fullWidth 
                            value={minimo_inventario}
                            onChange={this.handleChange('minimo_inventario')}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={24} className={styles.row}>
                    <Grid item xs={12} md={4} className={styles.paper}>
                        <TextField
                            label="Código"
                            className={styles.textField}
                            value={codigo}
                            onChange={this.handleChange('codigo')}
                            fullWidth
                            error={errorMessage !== ''}
                            helperText={errorMessage}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                startAdornment : 
                                    <InputAdornment position="start">
                                        {/* CODIGO DE BARRAS FONTAWESOME */}
                                        <i className="fa fa-barcode"></i>
                                    </InputAdornment>
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4} className={styles.paper}>
                        <TextField
                            label="Código producto"
                            className={styles.textField}
                            value={codigo_producto}
                            onChange={this.handleChange('codigo_producto')}
                            fullWidth
                            error={errorMessage !== ''}
                            helperText={errorMessage}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4} className={styles.paper}>
                        <TextField 
                            label="Máximo inventario"
                            fullWidth 
                            value={maximo_inventario}
                            onChange={this.handleChange('maximo_inventario')}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={24} className={styles.row}>
                    <Grid item xs={12} md={4} className={styles.paper}>
                        <FormControl className={styles.formControl} fullWidth>
                            <InputLabel htmlFor="linea">Linea de Producto</InputLabel>
                            <Select
                                value={linea}
                                native={true}
                                onChange={this.handleChange('linea')}
                                style={{textAlign : 'left'}}
                                inputProps={{
                                    name: 'linea',
                                    id: 'linea'
                                }}
                            >
                                <option value="">Seleccione</option>
                                {this.state.lineas.map((b, i) => <option key={i} value={b.id}>{b.nombre}</option> )}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4} className={styles.paper}>
                        <FormControl className={styles.formControl} fullWidth>
                            <InputLabel htmlFor="marca">Marca</InputLabel>
                            <Select
                                value={marca}
                                native={true}
                                onChange={this.handleChange('marca')}
                                style={{textAlign : 'left'}}
                                inputProps={{
                                    name: 'marca',
                                    id: 'marca'
                                }}
                            >
                                <option value="">Seleccione</option>
                                {this.state.marcas.map((b, i) => <option key={i} value={b.id}>{b.nombre}</option> )}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                <hr/>

                <Grid container spacing={24} className={styles.row}>
                    <Grid item xs={12} md={4} className={styles.paper}>
                        <FormControl className={styles.formControl} fullWidth>
                            <TextField
                                label="Palabras clave"
                                className={styles.textField}
                                value={_palabraclave}
                                onChange={this.handleChange('_palabraclave')}
                                onKeyPress={this.onKeyPress}
                                fullWidth
                                error={errorMessage !== ''}
                                helperText={errorMessage}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </FormControl>
                        <FormControl className={styles.formControl} fullWidth>
                            { palabrasclave.map((data) => 
                                <Chip
                                    key={data.key}
                                    label={data.label}
                                    className={classes.chip}
                                    onDelete={(env) => this.handleDelete(data)}
                                />
                            )}
                        </FormControl>
                    </Grid>
                    <Grid item xs={6} md={4} className={styles.paper}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="isBox"
                                    checked={isBox}
                                    onChange={this.handleChange('isBox')}
                                    value="isBox"
                                />
                            }
                            label="Es Paquete?"
                        />
                        { isBox &&
                            <TextField 
                                label="Cantidad de Unidades"
                                fullWidth 
                                value={cantidad_unidades}
                                onChange={this.handleChange('cantidad_unidades')}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        }
                    </Grid>
                    <Grid item xs={6} md={4} className={styles.paper}>
                        <div className="col-md-12">
                            <div>
                                <div className="col-md-6 inline-block">
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="isPromocion"
                                                checked={isPromocion}
                                                onChange={this.handleChange('isPromocion')}
                                                value="isPromocion"
                                            />
                                        }
                                        label="Promoción"
                                    />
                                </div>
                                <div className="col-md-6 inline-block"></div>
                            </div>
                            
                            <div>
                                <div className="col-md-6 inline-block">
                                    { isPromocion &&
                                        <TextField
                                            label="Desde"
                                            type="date"
                                            onChange={this.handleChange('promocion_desde')}
                                            fullWidth
                                            value={promocion_desde}
                                            error={promocion_desde && promocion_hasta ? moment(promocion_desde).isAfter(promocion_hasta) : false}
                                            helperText={promocion_desde && promocion_hasta ? moment(promocion_desde).isAfter(promocion_hasta) ? 'Fecha incorrecta' : '' : ''}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    }
                                </div>
                                <div className="col-md-6 inline-block">
                                    { isPromocion &&
                                        <TextField
                                            label="Hasta"
                                            type="date"
                                            onChange={this.handleChange('promocion_hasta')}
                                            fullWidth
                                            value={promocion_hasta}
                                            error={promocion_desde && promocion_hasta ? moment(promocion_hasta).isBefore(promocion_desde) : false}
                                            helperText={promocion_desde && promocion_hasta ? moment(promocion_hasta).isBefore(promocion_desde) ? 'Fecha incorrecta' : '' : ''}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    }
                                </div>
                            </div>
                            
                            <div style={{ marginTop : 10 }}>
                                <div className="col-md-6 inline-block">
                                    { isPromocion &&
                                        <TextField 
                                            label="Descuento"
                                            fullWidth 
                                            value={promocion_descuento}
                                            onChange={this.handleChange('promocion_descuento')}
                                        />
                                    }
                                </div>
                                <div className="col-md-6 inline-block">
                                    { isPromocion &&
                                        <FormControl className={styles.formControl} fullWidth>
                                            <InputLabel htmlFor="tipo_descuento" shrink={true}>Tipo Descuento</InputLabel>
                                            <Select
                                                value={promocion_tipo_descuento}
                                                native={true}
                                                onChange={this.handleChange('promocion_tipo_descuento')}
                                                style={{textAlign : 'left'}}
                                                inputProps={{
                                                    name: 'tipo_descuento',
                                                    id: 'tipo_descuento'
                                                }}
                                            >
                                                <option value="Porcentaje">Porcentaje</option>
                                                <option value="Cantidad">Cantidad</option>
                                            </Select>
                                        </FormControl>
                                    }
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
                <Grid container spacing={24} className={styles.row}>
                    <Grid item xs={12} md={4} className={styles.paper}>
                    
                    </Grid>
                    <Grid item xs={12} md={4} className={styles.paper}>
                    
                    </Grid>
                    <Grid item xs={12} md={4} className={styles.paper}>
                        
                    </Grid>
                </Grid>
                <Grid container spacing={24} className={styles.row}>
                    
                </Grid>
            </div>
        )
    }
}

export default withStyles(styles)(InformacionBasica)
import React from 'react'
import {
    RegularCard
} from './../components';
import axios from 'axios'
import Loader from 'react-loader'
import { withStyles } from 'material-ui/styles';
import { QUOTATION_ONE } from './../routing'
import {
    Button,
} from 'material-ui'
import green from 'material-ui/colors/green';
import classNames from 'classnames';
import AddIcon from '@material-ui/icons/Save';

const styles = theme => ({
    fab: {
        position: 'absolute',
        top: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2,
    },
    fabGreen: {
        color: theme.palette.common.white,
        backgroundColor: green[500],
    },
});

class VerCotizacion extends React.Component {

    state = {
        loading : false,
        folio : '',
        id : null,
        validSave : false,
        data : {
            productos : [],
            comprobantes : [],
            status_pago : ''
        }
    }

    getId(param = 'id'){
        let params = window.location.href.split('?')[1]
        params = params.split('&')
        let value = params.filter(r => {
            let entries = r.split('=')
            return entries[0] == param
        })[0]
        return parseInt(value.split('=')[1]) || 0
    }

    componentDidMount(){
        if(this.getId() > 0){
            axios.post(QUOTATION_ONE, {id: this.getId()})
            .then((r) => {
                this.setState({
                    data : r.data,
                    loading : false
                })
            })
            .catch(() => {
                this.setState({
                    loading : false
                })
            })   
        }
    }

    render(){
        const { loading, data, validSave, id } = this.state
        const { classes } = this.props
        return (
            <div>
                <Loader loaded={!loading} lines={13} length={20} width={10} radius={30}
                    corners={1} rotate={0} direction={1} color="#000" speed={1}
                    trail={60} shadow={false} hwaccel={false} className="spinner"
                    zIndex={2e9} top="50%" left="50%" scale={1.00}
                    loadedClassName="loadedContent" />

                <RegularCard
                    cardTitle={"Cotización #"+data.factura}
                    headerColor='blue'
                    classes={{
                        cardHeader : 'RegularCard-cardTitle-101'
                    }}
                    content = {
                        <div>
                            { (id && validSave) && 
                                <Button 
                                    variant="fab" 
                                    className={classNames(classes.fab, classes.fabGreen)} 
                                    color={'inherit'}
                                    onClick={this.save.bind(this)}>
                                    <AddIcon />
                                </Button>
                            }
                            <div className="row">
                                <div className="col-md-6">
                                    <fieldset>
                                        <legend>Información de la cotización</legend>
                                        <div className="form-group">
                                            <div className="col-md-4 inline-block">
                                                <label htmlFor="" className="label-control">
                                                    Factura
                                                </label>
                                            </div>
                                            <div className="col-md-8 inline-block text-left">
                                                { data.factura }
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-md-4 inline-block">
                                                <label htmlFor="" className="label-control">
                                                    Cliente
                                                </label>
                                            </div>
                                            <div className="col-md-8 inline-block text-left">
                                                { data.cliente }
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-md-4 inline-block">
                                                <label htmlFor="" className="label-control">
                                                    Fecha del Pedido
                                                </label>
                                            </div>
                                            <div className="col-md-8 inline-block text-left">
                                                { data.fecha }
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-md-4 inline-block">
                                                <label htmlFor="" className="label-control">
                                                    Subtotal
                                                </label>
                                            </div>
                                            <div className="col-md-8 inline-block text-left">
                                                $ { data.subtotal }
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-md-4 inline-block">
                                                <label htmlFor="" className="label-control">
                                                    Iva
                                                </label>
                                            </div>
                                            <div className="col-md-8 inline-block text-left">
                                                $ { data.iva }
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-md-4 inline-block">
                                                <label htmlFor="" className="label-control">
                                                    Descuento
                                                </label>
                                            </div>
                                            <div className="col-md-8 inline-block text-left">
                                                $ { data.descuento }
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-md-4 inline-block">
                                                <label htmlFor="" className="label-control">
                                                    Total Costo de Cotización
                                                </label>
                                            </div>
                                            <div className="col-md-8 inline-block text-left">
                                                $ { data.total }
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>
                            </div>
                            <br/>
                            <h4>Detalle de Productos</h4>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Producto</th>
                                        <th>Cantidad</th>
                                        <th>Precio</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { data.productos.map((p, i) => 
                                        <tr key={i}>
                                            <td>
                                                <img src={p.image} alt="Imagen" height={100}/>
                                            </td>
                                            <td>{p.nombre}<br/>{p.codigo}</td>
                                            <td>{p.cantidad}</td>
                                            <td>${p.precio}</td>
                                            <td>${p.cantidad*p.precio}</td>
                                        </tr>
                                    ) }
                                </tbody>
                            </table>
                        </div>
                    }
                />
            </div>
        )
    }
}

export default withStyles(styles, { withTheme: true })(VerCotizacion);
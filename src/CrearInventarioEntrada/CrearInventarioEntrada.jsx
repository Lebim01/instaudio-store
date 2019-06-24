import React from 'react'
import { withStyles } from "material-ui";
import {
    RegularCard,
    Button,
    ItemGrid
} from './../components';
import {
    TextField,
    Grid,
    Typography,
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableRow, 
    Tooltip
} from '@material-ui/core'
import './CrearInventarioEntrada.css'
import axios from 'axios'
import toastr from 'toastr'
import { ADD_INVENTORY, ONE_PRODUCTS } from './../routing'
import { UNEXPECTED } from './../dictionary'
import DialogAddProduct from './DialogAddProduct';
import AddProducto from './AddProducto'
import DialogHistoryPrice from './DialogHistoryPrice'

const styles = {
    underline : {
        backgroundColor : '#000'
    },
    paper : {
        display : 'inline-block'
    },
    backgroundColor : {
        backgroundColor : 'red'
    },
    fixwidth : {
        width : '30vh'
    }
}

class Crear extends React.Component {
    state = { 
        list : [], 
        historyPrices : [],
        factura : '', 
        proveedor : '', 
        producto : '',
        descuento : '',
        openAddProduct : false,
        openHistoryPrice : false
    }

    constructor(props){
        super(props)

        this.add = this.add.bind(this)
        this.save = this.save.bind(this)
        this.changeTotals = this.changeTotals.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.deleteProduct = this.deleteProduct.bind(this)
        this.handleAddProduct = this.handleAddProduct.bind(this)
        this.handleCloseAddProduct = this.handleCloseAddProduct.bind(this)
        this.openModalHistoryPrice = this.openModalHistoryPrice.bind(this)
        this.handleCloseHistoryPrice = this.handleCloseHistoryPrice.bind(this)
    }

    calculateTotals(){
        const { list } = this.state
        const _subtotal = this.round(list.reduce((a, b) => a + (b.cantidad * (b.precio_compra || b.placeholder_compra)), 0) || 0)
        const _iva = this.round(_subtotal * 0.16)
        const _descuento = this.round((_subtotal + _iva) * (this.state.descuento / 100))
        const _total = this.round(_subtotal + _iva - _descuento)

        this.setState({
            list,
            _subtotal,
            _iva,
            _descuento,
            _total
        })
    }

    handleChangeInput = name => event => {
        this.setState({
            [name]: event.target.value
        }, () => this.calculateTotals());
    }

    handleChange = (prod, index) => {
        let list = this.state.list
        list[index] = prod

        this.setState({
            list
        }, () => this.calculateTotals())
    }

    goList(){
        window.location.href = '/#/inventario'
    }

    save(e){
        e.preventDefault()
        const _products = this.state.list
        const { factura, proveedor, descuento, _descuento, _subtotal, _iva, _total } = this.state
        if(_products.length > 0){
            const params = {
                productos: _products, 
                token : localStorage.getItem('token'),
                factura,
                proveedor,
                descuento_porcentaje : descuento,
                descuento : _descuento,
                subtotal : _subtotal,
                iva : _iva,
                total:  _total
            }
            axios.post(ADD_INVENTORY, params)
            .then(({data}) => {
                if(data.status === 200){
                    toastr.success(`Se guardo con éxito`)
                    this.goList()
                }
                else if(data.message){
                    toastr.error(data.message)
                }
                else {
                    toastr.error(UNEXPECTED)
                }
            })
        }
    }

    add(){
        /**/
        
        // OPEN MODAL
        this.setState({
            openAddProduct : true
        })
    }

    handleCloseAddProduct(){
        this.setState({
            openAddProduct : false
        })
    }

    async handleAddProduct({ id_producto, precio_compra, precio_venta }){
        let list = this.state.list
        let exists = this.state.list.filter((p) => p.id_producto == id_producto).length > 0
        if(!exists){
            let product = (await axios.post(ONE_PRODUCTS, { id: id_producto })).data
            list.push({ 
                id_producto,
                producto : product.nombre,
                cantidad : 0,
                placeholder_compra : precio_compra,
                placeholder_venta : precio_venta
            })
            this.setState({
                list,
                openAddProduct : false
            })
        }else{
            toastr.error('Este producto ya esta en la lista')
        }
    }

    deleteProduct(id_producto){
        let list = this.state.list
        list = list.filter((p) => p.id_producto != id_producto)
        this.setState({
            list
        })
    }

    round(value){
        return Math.round(value * 100) / 100
    }

    openModalHistoryPrice(data){
        this.setState({
            openHistoryPrice : true,
            historyPrices : data
        })
    }

    handleCloseHistoryPrice(){
        this.setState({
            openHistoryPrice : false
        })
    }

    changeTotals(){
        const { descuento, list } = this.state

        const _subtotal = this.round(list.reduce((a, b) => a + (b.cantidad * (b.precio_compra || b.placeholder_compra)), 0) || 0)
        const _iva = this.round(_subtotal * 0.16)
        const _descuento = this.round((_subtotal + _iva) * (descuento / 100))
        const _total = this.round(_subtotal + _iva - _descuento)

        this.setState({
            _subtotal,
            _iva,
            _descuento,
            _total
        })
    }

    render(){
        const { list, factura, proveedor, descuento, _subtotal, _iva, _total, _descuento } = this.state
        const { black } = this.props
        const validos = list.filter(product => 
            product.id_producto > 0 &&
            (product.cantidad > 0 || product.cantidad < 0) &&
            (product.precio_compra > 0 || product.placeholder_compra > 0)
        )
        const isValid = validos.length == list.length && list.length > 0

        return (
            <div className="create-line">

                <DialogAddProduct
                    open={this.state.openAddProduct}
                    handleClose={this.handleCloseAddProduct}
                    handleAdd={this.handleAddProduct}
                />

                <DialogHistoryPrice
                    open={this.state.openHistoryPrice}
                    handleClose={this.handleCloseHistoryPrice}
                    data={this.state.historyPrices}
                />

                <Grid container>
                    <ItemGrid xs={12} sm={12} md={12}>
                        <RegularCard
                            cardTitle="Crear Entrada de Inventario"
                            cardSubtitle="Completa la información"
                            headerColor='blue'
                            classes={{
                                cardHeader : 'RegularCard-cardTitle-101'
                            }}
                            content={
                                <div>
                                    <Grid container spacing={24} className={styles.row}>
                                        <Grid item xs={12} md={4} className={styles.paper}>
                                            <TextField
                                                label="# Factura"
                                                className={styles.textField}
                                                value={factura}
                                                onChange={this.handleChangeInput('factura')}
                                                fullWidth
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4} className={styles.paper}>
                                            <TextField
                                                label="Proveedor"
                                                className={styles.textField}
                                                value={proveedor}
                                                onChange={this.handleChangeInput('proveedor')}
                                                fullWidth
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4} className={styles.paper}>
                                            <TextField
                                                label="% Descuento"
                                                className={styles.textField}
                                                value={descuento}
                                                placeholder="0-100 %"
                                                onChange={this.handleChangeInput('descuento')}
                                                fullWidth
                                                InputProps={{
                                                    type :"number"
                                                }}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                    <hr/>
                                    <Grid container spacing={24} className={styles.row}>
                                        <Grid item xs={12} md={4} className={styles.paper}>
                                            <Button classes={{ button: 'text-body primary' }} onClick={this.add}>
                                                Agregar Producto &nbsp;&nbsp;<i className="fa fa-plus"></i>
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </div>
                            }
                        />
                    </ItemGrid>
                    <ItemGrid xs={12} sm={12} md={12}>
                        <RegularCard
                            cardTitle="Productos"
                            headerColor='blue'
                            classes={{
                                cardHeader : 'RegularCard-cardTitle-101'
                            }}
                            content={
                                <div>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{width : 100}}></TableCell>
                                                <TableCell padding={'dense'}>
                                                    Producto
                                                </TableCell>
                                                <TableCell padding={'dense'}>Cantidad</TableCell>
                                                <TableCell padding={'dense'} style={{width : 200}}>
                                                    $ Precio Compra&nbsp;&nbsp;
                                                    <Tooltip title="Al quedar vació tomara como valor el ultimo precio registrado">
                                                        <span className="badge badge-warning text-light">
                                                            <i className="fa fa-info"></i> 
                                                        </span>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell style={{width : 150}}>
                                                    
                                                </TableCell>
                                                <TableCell style={{width : 150}}>
                                                    % Utilidad
                                                </TableCell>
                                                <TableCell padding={'dense'} style={{width : 200}}>
                                                    $ Precio Venta&nbsp;&nbsp;
                                                    <Tooltip title="Al quedar vació tomara como valor el ultimo precio registrado">
                                                        <span className="badge badge-warning text-light">
                                                            <i className="fa fa-info"></i> 
                                                        </span>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell padding={'dense'}></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            { list.map((prod, i) => 
                                                <AddProducto 
                                                    key={i}
                                                    {...prod} 
                                                    index={i}
                                                    black={black}
                                                    handleChange={this.handleChange}
                                                    deleteProduct={this.deleteProduct}
                                                    openModalHistoryPrice={this.openModalHistoryPrice}
                                                /> 
                                            ) }
                                        </TableBody>
                                    </Table>
                                    <Grid container spacing={24} className={styles.row}>
                                        <Grid item xs={12} md={6} style={{ ...styles.paper }}>
                                                
                                        </Grid>
                                        <Grid item xs={12} md={6} style={{ ...styles.paper }}>
                                            <br/>
                                            <br/>
                                            <br/>
                                            <Typography>
                                                <Grid container xs={12} md={12}>
                                                    <Grid item xs={6} md={2} style={{ ...styles.paper }}>
                                                        Subtotal:
                                                    </Grid>
                                                    <Grid item xs={6} md={10} style={{ ...styles.paper }}>
                                                        $ {_subtotal}
                                                    </Grid>
                                                </Grid>
                                                <hr/>
                                                <Grid container xs={12} md={12}>
                                                    <Grid item xs={6} md={2} style={{ ...styles.paper }}>
                                                        <Tooltip title="Subtotal * (1.6 / 100)">
                                                            <span>Iva:</span>
                                                        </Tooltip>
                                                    </Grid>
                                                    <Grid item xs={6} md={10} style={{ ...styles.paper }}>
                                                        $ {_iva}
                                                    </Grid>
                                                </Grid>
                                                <hr/>
                                                <Grid container xs={12} md={12}>
                                                    <Grid item xs={6} md={2} style={{ ...styles.paper }}>
                                                        <Tooltip title="(Subtotal + Iva) * (% Descuento / 100)">
                                                            <span>Descuento:</span>
                                                        </Tooltip>
                                                    </Grid>
                                                    <Grid item xs={6} md={10} style={{ ...styles.paper }}>
                                                        $ {_descuento}
                                                    </Grid>
                                                </Grid>
                                                <hr/>
                                                <Grid container xs={12} md={12}>
                                                    <Grid item xs={6} md={2} style={{ ...styles.paper }}>
                                                        <Tooltip title="Subtotal + Iva - Descuento">
                                                            <span>Total:</span>
                                                        </Tooltip>
                                                    </Grid>
                                                    <Grid item xs={6} md={10} style={{ ...styles.paper }}>
                                                        $ {_total}
                                                    </Grid>
                                                </Grid>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </div>
                            }
                            footer={
                                <div>
                                    <Button color="simple" classes={{ button: 'text-body' }} onClick={this.goList}>
                                        <i className="fa fa-arrow-left"></i>&nbsp;&nbsp;Regresar
                                    </Button>
                                    <Button color="success" onClick={this.save} disabled={!isValid}>
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

export default withStyles(styles)(Crear)
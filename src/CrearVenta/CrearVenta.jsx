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
    Tooltip,
    InputAdornment
} from '@material-ui/core'
import './CrearVenta.css'
import axios from 'axios'
import toastr from 'toastr'
import { ADD_SALE, ONE_PRODUCTS, GET_PRODUCT_CODE, SUGGESTED_PRICES, COTIZAR } from './../routing'
import { UNEXPECTED } from './../dictionary'
import DialogAddProduct from './DialogAddProduct';
import AddProducto from './AddProducto'
import DialogHistoryPrice from '../CrearInventarioEntrada/DialogHistoryPrice'
import DialogAddConcepto from './DialogAddConcepto'
import ConceptoRow from './ConceptoRow'
import Hotkeys from 'react-hot-keys'
import Swal from 'sweetalert2'

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
        conceptos : [],
        factura : '', 
        cliente : 'CLIENTE DE MOSTRADOR', 
        producto : '',
        descuento : '',
        historyPrices : [],
        codigo : '',
        errorCode : '',

        openAddProduct : false,
        openAddConcepto : false,
    }

    constructor(props){
        super(props)

        this.add = this.add.bind(this)
        this.save = this.save.bind(this)
        this.goList = this.goList.bind(this)
        this.addConcepto = this.addConcepto.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.saveConcepto = this.saveConcepto.bind(this)
        this.closeConcepto = this.closeConcepto.bind(this)
        this.deleteProduct = this.deleteProduct.bind(this)
        this.handleAddProduct = this.handleAddProduct.bind(this)
        this.handleCloseAddProduct = this.handleCloseAddProduct.bind(this)
        this.openModalHistoryPrice = this.openModalHistoryPrice.bind(this)
        this.handleCloseHistoryPrice = this.handleCloseHistoryPrice.bind(this)
    }

    calculateTotals(){
        const { list, conceptos } = this.state
        const _subtotal = this.round(list.reduce((a, b) => {
            return a + (b.cantidad * (b.precio_venta || b.placeholder_venta[b.tipo_precio]))
        }, 0) || 0)
        const _iva = this.round(_subtotal * 0.16)
        const _descuento = this.round((_subtotal + _iva) * (this.state.descuento / 100))
        const _total = this.round(_subtotal + _iva - _descuento)

        const _total_conceptos = this.round(conceptos.reduce((a,b) => a + (b.precio || 0), 0) || 0)

        this.setState({
            list,
            _subtotal,
            _iva,
            _descuento,
            _total : _total + _total_conceptos
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
        this.props.history.push({
            pathname : '/ventas'
        })
    }

    async calcularPrecios(){
        const { id_producto, } = this.state
        const r = await axios.post(SUGGESTED_PRICES, { id_producto, cantidad : 0, precio_compra : null })
        return r.data || { precio_compra : '', precio_venta : '' }
    }

    handleAddInput = async () => {
        if(this.state.id_producto){
            const { precio_compra, precio_venta } = await this.calcularPrecios()
            this.handleAddProduct({ precio_compra, precio_venta, ...this.state })
            this.setState({
                codigo : ''
            })
        }
    }

    validCodeProduct = async () => {
        try {
            let r = await axios.post(GET_PRODUCT_CODE, { code : this.state.codigo })
            if(r.data.id){
                this.setState({
                    errorCode : false,
                    id_producto : r.data.id
                })
                this.handleAddInput()
            }else{
                throw 'Producto no conocido'
            }
        }catch(e){
            this.setState({
                errorCode : true,
                errorCodeMessage : e
            })
        }
    }

    handleKeyPress = (event) => {
        if (event.key === 'Enter'){ 
            event.preventDefault();
            this.validCodeProduct()
        }
    }

    save(e){
        e.preventDefault()
        const _products = this.state.list
        const { factura, conceptos, cliente, email, celular, descuento, _descuento, _subtotal, _iva, _total } = this.state
        if(_products.length > 0){
            const params = {
                productos: _products, 
                conceptos : conceptos,
                token : localStorage.getItem('token'),
                factura,
                cliente,
                email,
                celular,
                descuento_porcentaje : descuento,

                descuento : _descuento,
                subtotal : _subtotal,
                iva : _iva,
                total:  _total
            }
            
            axios.post(ADD_SALE, params)
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

            this.cambio(_total).then(()=>{
                setTimeout(function() {
                    const swalWithBootstrapButtons = Swal.mixin({
                        customClass: {
                          confirmButton: 'btn btn-success',
                          cancelButton: 'btn btn-danger'
                        },
                        buttonsStyling: false,
                      })
                      
                      swalWithBootstrapButtons.fire({
                        title: 'Desea confirmar la venta?',
                        text: "",
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Confirmar',
                        cancelButtonText: 'Cancelar',
                        reverseButtons: true
                      }).then((result) => {
                        if (result.value) {
                          swalWithBootstrapButtons.fire(
                            'Venta Realizada',
                            'Se ha realizado la venta correctamente',
                            'success'
                          )
                          axios.post(ADD_SALE, params)
                          .then(({data}) => {
                              if(data.status === 200){
                             toastr.success(`Se guardo con éxito`)
                             window.location.reload();
                              }
                              else if(data.message){
                                  toastr.error(data.message)
                              }
                              else {
                                  toastr.error(UNEXPECTED)
                              }
                          })
                        } else if (
                          // Read more about handling dismissals
                          result.dismiss === Swal.DismissReason.cancel
                        ) {
                          swalWithBootstrapButtons.fire(
                            'Cancelado',
                            'La venta ha sido cancelada',
                            'error'
                          )
                        }
                      })
                 }, 5000)
            })
           
        }
    }

    cambio = async (total) => {
        const {value: number} = await Swal.fire({
            title: 'Ingrese el efectivo',
            input: 'number',
            inputPlaceholder: 'Ingrese efectivo'
        })
          
        if (number) {
            let resultado;
            resultado = number-total;
            Swal.fire('EL cambio es: ' + resultado)
        }
    }

    cotizar = async (e) => {
        e.preventDefault()

        const _products = this.state.list
        const { factura, cliente, descuento, _descuento, _subtotal, _iva, _total } = this.state
        const params = {
            productos: _products, 
            token : localStorage.getItem('token'),
            factura,
            cliente,
            descuento_porcentaje : descuento,

            descuento : _descuento,
            subtotal : _subtotal,
            iva : _iva,
            total:  _total
        }

        function cotizarAjax(){
            return axios.post(COTIZAR, params)
                .then(response => {
                    return response
                })
                .catch(error => {
                    Swal.showValidationMessage(`Request failed: ${error}`)
                })
        }

        Swal.fire({
            title: 'Confirmar',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            showLoaderOnConfirm: true,
            preConfirm: cotizarAjax,
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.value) {
                Swal.fire('Guardado', 'Se cotizo con éxito', 'success')
                if(result.value.data.url){
                    window.open(result.value.data.url, '_blank')
                }
            }
        })
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
        let cantidad_producto = 0;
        let list = this.state.list
        let exists = this.state.list.filter((p) => p.id_producto == id_producto).length > 0
        if(!exists){
            let  estado_inventario;
            let product = (await axios.post(ONE_PRODUCTS, { id: id_producto })).data
            if(product.inventario == 0){
                Swal.fire('Este producto no cuenta con una cantidad adecuada en el inventario para vender')
                this.setState({
                    openAddProduct : false
                })
            }else{
                if(product.inventario == 0){ estado_inventario = 'INEDITABLE'; cantidad_producto =0;} else {estado_inventario = product.inventario; cantidad_producto = 1;}
                list.push({ 
                    id_producto, 
                    codigo : product.codigo, 
                    image : product.photos[0] || '', 
                    producto : product.nombre, 
                    cantidad : cantidad_producto, 
                    placeholder_compra : precio_compra, 
                    placeholder_venta : product.precios,
                    inventario :  estado_inventario,
                    isPromocion : product.isPromocion == 1,
                    descripcion : product.descripcion,
                    tipo_precio : 'Menudeo'
                })
                this.setState({
                    list,
                    openAddProduct : false
                }, this.calculateTotals)
            }
        }else{
            toastr.error('Este producto ya esta en la lista')
        }
    }

    deleteProduct(id_producto){
        let list = this.state.list
        list = list.filter((p) => p.id_producto != id_producto)
        this.setState({
            list
        }, () => this.calculateTotals())
    }

    round(value){
        return Math.round(Number(value) * 100) / 100
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

    onKeyDown(keyName, e, handle) {
        switch(keyName){
            case 'f2':
                document.getElementById('codigo').focus()
            break;
        }
    }

    closeConcepto(){
        this.setState({
            openAddConcepto : false
        })
    }

    addConcepto(){
        this.setState({
            openAddConcepto : true
        })
    }

    saveConcepto({ precio, concepto }){
        this.setState({
            openAddConcepto : false,
            conceptos : [
                ...this.state.conceptos,
                {
                    concepto,
                    precio
                }
            ]
        })
    }

    render(){
        const { list, factura, cliente, descuento, _subtotal, _iva, _total, _descuento, codigo, errorCode } = this.state
        const { black } = this.props
        const validos = list.filter(product => 
            product.id_producto > 0 &&
            (product.cantidad > 0 || product.cantidad < 0)
        )
        const isValid = validos.length == list.length && list.length > 0

        return (
            <Hotkeys 
                keyName="f2"
                onKeyDown={this.onKeyDown.bind(this)}
            >
                <div className="create-line">
                    <DialogAddProduct
                        open={this.state.openAddProduct}
                        handleClose={this.handleCloseAddProduct}
                        handleAdd={this.handleAddProduct}
                    />

                    <DialogAddConcepto
                        open={this.state.openAddConcepto}
                        save={this.saveConcepto}
                        close={this.closeConcepto}
                    />

                    <DialogHistoryPrice
                        open={this.state.openHistoryPrice}
                        handleClose={this.handleCloseHistoryPrice}
                        data={this.state.historyPrices}
                    />

                    <Grid container>
                        <Grid item xs={12} sm={12} md={12} style={{marginTop : 0, marginBottom : 5}} className="no-margin">
                            <RegularCard
                                cardTitle="Crear Venta"
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
                                        <Grid container spacing={24} className={styles.row}>
                                            <Grid item xs={12} md={4} className={styles.paper}>
                                                <TextField
                                                    label="Cliente"
                                                    className={styles.textField}
                                                    value={cliente}
                                                    onChange={this.handleChangeInput('cliente')}
                                                    fullWidth
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={4} className={styles.paper}>
                                                <TextField
                                                    label="Email"
                                                    className={styles.textField}
                                                    value={this.state.email}
                                                    onChange={this.handleChangeInput('email')}
                                                    fullWidth
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={4} className={styles.paper}>
                                                <TextField
                                                    label="Celular"
                                                    className={styles.textField}
                                                    value={this.state.celular}
                                                    onChange={this.handleChangeInput('celular')}
                                                    fullWidth
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                        <hr/>
                                        <Grid container spacing={24} className={styles.row}>
                                            <Grid item xs={12} md={4} className={styles.paper}>
                                                <TextField
                                                    id="codigo"
                                                    label="Código"
                                                    className={styles.textField}
                                                    value={codigo}
                                                    onChange={this.handleChangeInput('codigo')}
                                                    onKeyPress={this.handleKeyPress}
                                                    error={errorCode}
                                                    helperText={errorCode ? 'Código no conocido' : ''}
                                                    fullWidth
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    InputProps={{
                                                        startAdornment : 
                                                            <InputAdornment position="start">
                                                                <i className="fa fa-barcode"></i>
                                                            </InputAdornment>
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={4} className={styles.paper}>
                                                <Button classes={{ button: 'text-body primary' }} onClick={this.add}>
                                                    Agregar Producto &nbsp;&nbsp;<i className="fa fa-plus"></i>
                                                </Button>
                                                <Button classes={{ button: 'text-body secondary' }} onClick={this.addConcepto}>
                                                    Agregar Concepto &nbsp;&nbsp;<i className="fa fa-plus"></i>
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </div>
                                }
                            />
                        </Grid>
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
                                                    <TableCell padding={'dense'}></TableCell>
                                                    <TableCell padding={'dense'}>
                                                        Producto
                                                    </TableCell>
                                                    <TableCell padding={'dense'} style={{width : 200}}>
                                                        Cantidad
                                                    </TableCell>
                                                    <TableCell padding={'dense'} style={{width : 200}}>
                                                        $ Precio Venta
                                                    </TableCell>
                                                    <TableCell padding={'dense'} style={{width : 200}}></TableCell>
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
                                                { this.state.conceptos.map((props, i) =>
                                                    <ConceptoRow
                                                        key={i}
                                                        index={i}
                                                        {...props}
                                                    />
                                                )}
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
                                            Vender
                                        </Button>
                                        <Button color="success" onClick={this.cotizar}>
                                            Cotizar
                                        </Button>
                                    </div>
                                }
                            />
                        </ItemGrid>
                    </Grid>
                </div>
            </Hotkeys>
        )
    }
}

export default withStyles(styles)(Crear)
import React from 'react'
import NumberFormat from 'react-number-format';
import {
    DeleteForever,
    AttachMoney
} from '@material-ui/icons'
import axios from 'axios'
import {
    CustomInput,
    Button
} from './../components';
import {
    TextField,
    TableCell, 
    TableRow, 
    Tooltip,
    Fab
} from '@material-ui/core'
import DelayInput from './DelayInput'
import { LIST_PRICE_PRODUCT, SUGGESTED_PRICES } from './../routing'

function NumberFormatCustom(props) {
    const { inputRef, onChange, ...other } = props;
    return (
        <NumberFormat
            {...other}
            ref={inputRef}
            onValueChange={values => {
                onChange({
                    target: {
                        value: values.value,
                    },
                });
            }}
            thousandSeparator
            prefix="$"
        />
    );
}

function NumberFormatCustom2(props) {
    const { inputRef, onChange, ...other } = props;
    return (
        <NumberFormat
            {...other}
            ref={inputRef}
            onValueChange={values => {
                onChange({
                    target: {
                        value: values.value,
                    },
                });
            }}
            thousandSeparator
            prefix=""
        />
    );
}

class AddProducto extends React.Component {

    constructor(props){
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.historyPrice = this.historyPrice.bind(this)
    }

    handleChange = (name) => (event) => {
        let data = { 
            id_producto : this.props.id_producto,
            cantidad : this.props.cantidad,
            precio_compra : this.props.precio_compra,
            placeholder_compra : this.props.placeholder_compra,
            placeholder_venta_menudeo : this.props.placeholder_venta_menudeo,
            placeholder_venta_mayoreo : this.props.placeholder_venta_mayoreo,
            placeholder_venta_semimenudeo : this.props.placeholder_venta_semimenudeo,
            utilidad_mayoreo : this.props.utilidad_mayoreo,
            utilidad_menudeo : this.props.utilidad_menudeo,
            utilidad_semimenudeo : this.props.utilidad_semimenudeo,
            precio_venta_mayoreo : this.props.precio_venta_mayoreo,
            precio_venta_menudedo : this.props.precio_venta_menudedo,
            precio_venta_semimenudeo : this.props.precio_venta_semimenudeo
        }
        data[name] = event.target.value
        this.props.handleChange(data, this.props.index)

        if(name === 'precio_compra' || name === 'cantidad'){
            this.actualizarPrecioMayoreo(data)
            this.actualizarPrecioMenudeo(data)
            this.actualizarPrecioSemimenudeo(data)
        }
        if(name === 'utilidad_menudeo') this.actualizarPrecioMenudeo(data)
        if(name === 'utilidad_semimenudeo') this.actualizarPrecioSemimenudeo(data)
        if(name === 'utilidad_mayoreo') this.actualizarPrecioMayoreo(data)
    }

    async actualizarPrecioMenudeo(data){
        const { precio_venta } = await this.calcularPrecios({
            precio_compra : data.precio_compra,
            cantidad : data.cantidad,
            utilidad : data.utilidad_menudeo,
            tipo : 'Menudeo'
        })
        data.placeholder_venta_menudeo = precio_venta
        this.props.handleChange(data, this.props.index)
    }

    async actualizarPrecioSemimenudeo(data){
        const { precio_venta } = await this.calcularPrecios({
            precio_compra : data.precio_compra,
            cantidad : data.cantidad,
            utilidad : data.utilidad_semimenudeo,
            tipo : 'Semimenudeo'
        })
        data.placeholder_venta_semimenudeo = precio_venta
        this.props.handleChange(data, this.props.index)
    }

    async actualizarPrecioMayoreo(data){
        const { precio_venta } = await this.calcularPrecios({
            precio_compra : data.precio_compra,
            cantidad : data.cantidad,
            utilidad : data.utilidad_mayoreo,
            tipo : 'Mayoreo'
        })
        data.placeholder_venta_mayoreo = precio_venta
        this.props.handleChange(data, this.props.index)
    }

    async calcularPrecios({ cantidad, precio_compra, utilidad, tipo }){
        const { id_producto } = this.props
        const r = await axios.post(SUGGESTED_PRICES, { id_producto, cantidad, precio_compra, utilidad, tipo })
        return r.data || { precio_venta : '' }
    }

    async historyPrice(){
        const { id_producto } = this.props
        let r = await axios.post(LIST_PRICE_PRODUCT, { id_producto })
        let data = r.data
        this.props.openModalHistoryPrice(data)
    }

    render(){
        const { 
            id_producto, 
            producto, 
            cantidad, 
            precio_venta_mayoreo,
            precio_venta_menudedo,
            precio_venta_semimenudeo, 
            precio_compra, 
            placeholder_compra, 
            placeholder_venta_mayoreo,
            placeholder_venta_menudeo,
            placeholder_venta_semimenudeo,
            utilidad_menudeo, 
            utilidad_mayoreo, 
            utilidad_semimenudeo
        } = this.props
        return (
            <TableRow>
                <TableCell padding={'dense'}>
                    <Tooltip title="Ver historial de precio de este producto">
                        <Fab size="small" className="warning" onClick={this.historyPrice}>
                            <AttachMoney />
                        </Fab>
                    </Tooltip>
                </TableCell>
                <TableCell padding={'dense'}>
                    <TextField
                        value={producto}
                        fullWidth={true}
                        InputProps={{
                            readOnly: true
                        }}
                    />
                </TableCell>
                <TableCell padding={'dense'} style={{width: 100, maxWidth: 100}}>
                    <CustomInput
                        id="cantidad"
                        formControlProps={{
                            style : {
                                margin: 0
                            },
                            fullWidth : true
                        }}
                        classes={{
                            underline : '#000'
                        }}
                        inputProps={{
                            onChange: this.handleChange('cantidad'),
                            value : cantidad,
                            type : 'number',
                            min : 1
                        }}
                    />
                </TableCell>
                <TableCell padding={'dense'}>
                    <DelayInput
                        value={precio_compra}
                        fullWidth={true}
                        onChange={this.handleChange('precio_compra')}
                        placeholder={placeholder_compra}
                        InputProps={{
                            inputComponent: NumberFormatCustom
                        }}
                    />
                </TableCell>
                <TableCell padding={'dense'}>
                    <CustomInput
                        formControlProps={{
                            style : {
                                margin: 0
                            },
                            fullWidth : true
                        }}
                        classes={{
                            underline : '#000'
                        }}
                        inputProps={{
                            value : 'Menudeo',
                            readOnly : true
                        }}
                    />
                    <CustomInput
                        formControlProps={{
                            style : {
                                margin: 0
                            },
                            fullWidth : true
                        }}
                        classes={{
                            underline : '#000'
                        }}
                        inputProps={{
                            value : 'Semi menudeo',
                            readOnly : true
                        }}
                    />
                    <CustomInput
                        formControlProps={{
                            style : {
                                margin: 0
                            },
                            fullWidth : true
                        }}
                        classes={{
                            underline : '#000'
                        }}
                        inputProps={{
                            value : 'Mayoreo',
                            readOnly : true
                        }}
                    />
                </TableCell>
                <TableCell padding={'dense'} style={{width: 100, maxWidth: 100}}>
                    <DelayInput
                        value={utilidad_menudeo}
                        fullWidth={true}
                        onChange={this.handleChange('utilidad_menudeo')}
                        InputProps={{
                            inputComponent: NumberFormatCustom2
                        }}
                    />
                    <br/>
                    <br/>
                    <DelayInput
                        value={utilidad_semimenudeo}
                        fullWidth={true}
                        onChange={this.handleChange('utilidad_semimenudeo')}
                        InputProps={{
                            inputComponent: NumberFormatCustom2
                        }}
                    />
                    <br/>
                    <br/>
                    <DelayInput
                        value={utilidad_mayoreo}
                        fullWidth={true}
                        onChange={this.handleChange('utilidad_mayoreo')}
                        InputProps={{
                            inputComponent: NumberFormatCustom2
                        }}
                    />
                </TableCell>
                <TableCell padding={'dense'}>
                    <TextField
                        value={precio_venta_menudedo}
                        fullWidth={true}
                        onChange={this.handleChange('precio_venta_menudeo')}
                        placeholder={placeholder_venta_menudeo}
                        InputProps={{
                            inputComponent: NumberFormatCustom
                        }}
                    />
                    <br/>
                    <br/>
                    <TextField
                        value={precio_venta_semimenudeo}
                        fullWidth={true}
                        onChange={this.handleChange('precio_venta_semimenudeo')}
                        placeholder={placeholder_venta_semimenudeo}
                        InputProps={{
                            inputComponent: NumberFormatCustom
                        }}
                    />
                    <br/>
                    <br/>
                    <TextField
                        value={precio_venta_mayoreo}
                        fullWidth={true}
                        onChange={this.handleChange('precio_venta_mayoreo')}
                        placeholder={placeholder_venta_mayoreo}
                        InputProps={{
                            inputComponent: NumberFormatCustom
                        }}
                    />
                </TableCell>
                <TableCell padding={'dense'} style={{width: 100, maxWidth: 100}}>
                    <Button size="small" color="inherent" variant="contained" className="danger" style={{backgroundColor: 'red', color : 'white'}} onClick={() => this.props.deleteProduct(id_producto)}>
                        <DeleteForever />
                    </Button>
                </TableCell>
            </TableRow>
        )
    }
}

AddProducto.defaultProps = {
    id_producto : '',
    id_marca : '',
    cantidad : 0,
    utilidad : 0,
    index : -1,
    marcas : [],
    placeholder_compra : '',
    placeholder_venta : '',
    handleChange : () => {}
}

export default AddProducto
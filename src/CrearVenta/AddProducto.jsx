import React from 'react'
import NumberFormat from 'react-number-format';
import {
    DeleteForever,
    AttachMoney,
    NewReleases
} from '@material-ui/icons'
import axios from 'axios'
import {
    Button
} from './../components';
import {
    TextField,
    TableCell, 
    TableRow, 
    Tooltip,
    Fab,
    Select
} from '@material-ui/core'
import { LIST_PRICE_PRODUCT } from './../routing'

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

class AddProducto extends React.Component {

    constructor(props){
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.historyPrice = this.historyPrice.bind(this)
    }

    handleChange = (name) => async (event) => {
        const { id_producto, codigo, image, cantidad, precio_compra, precio_venta, placeholder_compra, placeholder_venta, utilidad, inventario, descripcion, tipo_precio } = this.props
        let data = { id_producto, codigo, image, cantidad, precio_compra, precio_venta, placeholder_compra, placeholder_venta, utilidad, inventario, descripcion, tipo_precio }
        data[name] = event.target.value
        this.props.handleChange(data, this.props.index)
    }

    async historyPrice(){
        const { id_producto } = this.props
        let r = await axios.post(LIST_PRICE_PRODUCT, { id_producto })
        let data = r.data
        this.props.openModalHistoryPrice(data)
    }

    render(){
        const { id_producto, producto, codigo, cantidad, precio_venta, placeholder_venta, inventario, image, isPromocion, descripcion, tipo_precio } = this.props

        return (
            <TableRow>
                <TableCell padding={'dense'}>
                    <Tooltip title="Ver historial de precio de este producto">
                        <Fab size="small" className="warning" onClick={this.historyPrice}>
                            <AttachMoney />
                        </Fab>
                    </Tooltip>
                    { isPromocion &&
                        <Tooltip title="Este producto tiene descuento">
                            <Fab size="small" className="success">
                                <NewReleases />
                            </Fab>
                        </Tooltip>
                    }
                </TableCell>
                <TableCell padding={'dense'} style={{width: 200, maxWidth : 200}}>
                    <img src={image.url} alt="Imagen" height={100}/> 
                </TableCell>
                <TableCell padding={'dense'}>
                    <Tooltip title={descripcion}>
                        <TextField
                            value={producto}
                            fullWidth={true}
                            InputProps={{
                                readOnly: true
                            }}
                        />
                    </Tooltip>
                    <br/>
                    <span>{codigo}</span>
                </TableCell>
                <TableCell padding={'dense'} style={{width: 100, maxWidth: 100}}>
                    <TextField
                        value={cantidad}
                        fullWidth={true}
                        onChange={this.handleChange('cantidad')}
                        inputProps={{
                            type : 'number',
                            value : cantidad
                        }}
                        helperText={"Disponible " + inventario}
                    />
                </TableCell>
                <TableCell padding={'dense'}>
                    <Select
                        value={tipo_precio}
                        native={true}
                        onChange={this.handleChange('tipo_precio')}
                        style={{textAlign : 'left'}}
                    >
                        <option value="Menudeo">Menudeo</option>
                        <option value="Semimenudeo">Semimenudeo</option>
                        <option value="Mayoreo">Mayoreo</option>
                    </Select>
                    <TextField
                        value={precio_venta}
                        fullWidth={true}
                        onChange={this.handleChange('precio_venta')}
                        placeholder={placeholder_venta[tipo_precio]}
                        InputProps={{
                            inputComponent: NumberFormatCustom
                        }}
                    />
                </TableCell>
                <TableCell padding={'dense'} style={{width: 100, maxWidth: 100}}>
                    <Button size="small" color="inherent" variant="contained" className="danger" style={{color: 'white', backgroundColor : 'red'}} onClick={() => this.props.deleteProduct(id_producto)}>
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
    index : -1,
    marcas : [],
    placeholder_compra : '',
    placeholder_venta : '',
    handleChange : () => {}
}

export default AddProducto
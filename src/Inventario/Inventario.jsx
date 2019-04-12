import React from 'react'
import axios from 'axios'
import { withStyles } from '@material-ui/core/styles'
import TableUI from './../components/TableUI'
import { TableCell, TableRow } from 'material-ui/Table'
import { INVENTORY } from './../routing'
import {
    RegularCard
} from './../components';
import Loader from 'react-loader'
import {
    Fab,
    Tooltip
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
    },
    button: {
        margin: theme.spacing.unit,
    }
});

const columnData = [
    { id: 'image', numeric: false, disablePadding: false, label: '', sortable : false, filterable : false },
    { id: 'producto', numeric: false, disablePadding: false, label: 'Producto', sortable : true, filterable : true },
    { id: 'ultima_compra', numeric: false, disablePadding: false, label: 'Ultima Compra', sortable : false },
    { id: 'ultima_venta', numeric: false, disablePadding: false, label: 'Ultima Venta', sortable : false },
    { id: 'cantidad', numeric: true, disablePadding: false, label: 'Cantidad', sortable : true },
];

const goAdd = () => {
    window.location = '#/inventario/create'
}

class Inventario extends React.Component {

    state = { data : [], loading : true }

    constructor(props){
        super(props)

        this.RowFormat = this.RowFormat.bind(this)
    }

    componentDidMount(){
        axios.post(INVENTORY)
        .then((r) => {
            if(r.data){
                this.setState({
                    data : r.data,
                    loading : false
                })
            }
        })
        .catch(() => {
            this.setState({
                loading : false
            })
        })
    }

    dateToFormat(date){
        if(!date) return ''
        let _p = date.split('-')
        return `${_p[2]}/${_p[1]}/${_p[0]}`
    }
    
    RowFormat = props => (
        <TableRow
            hover
            tabIndex={-1}
            key={props.id}
        >
            <TableCell >
                <img src={props.image} alt="Imagen" height={100}/>
            </TableCell>
            <TableCell >{props.producto}</TableCell>
            <TableCell >{this.dateToFormat(props.ultima_compra)}</TableCell>
            <TableCell >{this.dateToFormat(props.ultima_venta)}</TableCell>
            <TableCell numeric>{props.cantidad}</TableCell>
        </TableRow>
    )

    render(){
        const { data, loading } = this.state

        return (
            <div>
                <Loader loaded={!loading} lines={13} length={20} width={10} radius={30}
                    corners={1} rotate={0} direction={1} color="#000" speed={1}
                    trail={60} shadow={false} hwaccel={false} className="spinner"
                    zIndex={2e9} top="50%" left="50%" scale={1.00}
                    loadedClassName="loadedContent" />
                <RegularCard
                    cardTitle="Inventario"
                    headerColor='red'
                    content = {
                        <div>
                            <Tooltip title="Agregar">
                                <Fab variant="fab" color="secondary" aria-label="Add" size="small" style={{float:'right'}} onClick={goAdd}>
                                    <AddIcon />
                                </Fab>
                            </Tooltip>
                            <TableUI 
                                RowFormat={this.RowFormat}
                                data={data}
                                columnData={columnData}
                                pagination={true}
                            />
                        </div>
                    }
                />
            </div>
        )
    }
}

export default withStyles(styles)(Inventario);
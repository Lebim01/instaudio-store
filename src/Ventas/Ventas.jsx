import React from 'react'
import axios from 'axios'
import TableUI from './../components/TableUI'
import { SALES } from './../routing'
import {
    RegularCard
} from './../components';
import Loader from 'react-loader'
// COMPONENTS
import {
    Button, TableCell, TableRow, Tooltip, Fab
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'

const columnData = [
    { id: 'factura', label: 'Factura', sortable : true, filterable : true },
    { id: 'fecha', label: 'Fecha', sortable : true, filterable : true },
    { id: 'cliente', label: 'Cliente', sortable : true, filterable : true },
    { id: 'total', label: 'Total $', sortable : true, filterable : true },
    { id: 'actions', label : 'Acciones', sortable : false, style : { minWidth : 150 } }
];

class Ventas extends React.Component {
    state = {
        data : [],
        loading : true
    }

    constructor(props){
        super(props)
        this.go = this.go.bind(this)
        this.goAdd = this.goAdd.bind(this)
    }

    go(id){
        this.props.history.push({
            pathname: '/ventas/show?id='+id,
        })
    }

    goAdd(){
        this.props.history.push({
            pathname: '/ventas/create',
        })
    }

    RowFormat = props => {
        return (
            <TableRow
                hover
                tabIndex={-1}
                key={props.id}
            >
                <TableCell>{props.factura}</TableCell>
                <TableCell>{props.fecha}</TableCell>
                <TableCell>{props.cliente}</TableCell>
                <TableCell>{props.total}</TableCell>
                <TableCell>
                    <Button onClick={()=>this.go(props.id)}>
                        Ver
                    </Button>
                </TableCell>
            </TableRow>
        );
    }
    
    componentDidMount(){
        axios.post(SALES)
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
                    cardTitle="Listado de Ventas"
                    headerColor='blue'
                    classes={{
                        cardHeader : 'RegularCard-cardTitle-101'
                    }}
                    content = {
                        <div>
                            <Tooltip title="Agregar">
                                <Fab variant="fab" color="inherent" aria-label="Add" size="small" style={{float:'right', backgroundColor : 'green', color : 'white'}} onClick={this.goAdd}>
                                    <AddIcon />
                                </Fab>
                            </Tooltip>
                            <TableUI 
                                RowFormat={this.RowFormat}
                                order={'asc'}
                                orderBy={'nombre'}
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

export default Ventas
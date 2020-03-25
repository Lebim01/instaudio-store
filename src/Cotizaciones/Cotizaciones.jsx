import React from 'react'
import axios from 'axios'
import TableUI from './../components/TableUI'
import { QUOTATIONS } from './../routing'
import {
    RegularCard
} from './../components';
import Loader from 'react-loader'
// COMPONENTS
import {
    Button, TableCell, TableRow
} from '@material-ui/core'

const columnData = [
    { id: 'factura', label: 'Factura', sortable : true, filterable : true },
    { id: 'fecha', label: 'Fecha', sortable : true, filterable : true },
    { id: 'cliente', label: 'Cliente', sortable : true, filterable : true },
    { id: 'total', label: 'Total $', sortable : true, filterable : true },
    { id: 'actions', label : 'Acciones', sortable : false, style : { minWidth : 150 } }
];

class Cotizaciones extends React.Component {
    state = {
        data : [],
        loading : true
    }

    constructor(props){
        super(props)
        this.go = this.go.bind(this)
    }

    go(id){
        this.props.history.push({
            pathname: '/cotizaciones/show?id='+id,
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
        axios.post(QUOTATIONS)
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
                    cardTitle="Listado de Cotizaciones"
                    headerColor='blue'
                    classes={{
                        cardHeader : 'RegularCard-cardTitle-101'
                    }}
                    content = {
                        <div>
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

export default Cotizaciones
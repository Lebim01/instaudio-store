import React from 'react'
import { INVENTARIO_NOTIFIY_LIST } from './../routing'
import axios from 'axios'
import TableUI from './../components/TableUI'
import Loader from 'react-loader'
import { RegularCard } from './../components';
import {
    TableRow,
    TableCell,
} from '@material-ui/core'

const columnData = [
    { id: 'image', numeric: false, label: '', sortable : false, filterable : false },
    { id: 'producto', numeric: false, label: 'Producto', sortable : true, filterable : true },
    { id: 'minimo', numeric: false, label: 'Minimo', sortable : true, filterable : true },
    { id: 'inventario', numeric: false, label: 'Inventario', sortable : true, filterable : true },
];

class Notificaciones extends React.Component {
    state = { data : [], loading : true }

    componentDidMount(){
        let self =this
        axios.post(INVENTARIO_NOTIFIY_LIST)
        .then((r) => {
            const { data } = r
            self.setState({
                data,
                loading : false
            })
        })
    }

    RowFormat = props => {
        return (
            <TableRow
                hover
                tabIndex={-1}
                key={props.id}
            >
                <TableCell>
                    <img src={props.image} alt="Imagen" height="100"/>
                </TableCell>
                <TableCell>{props.producto}</TableCell>
                <TableCell>{props.minimo_inventario}</TableCell>
                <TableCell>{props.inventario}</TableCell>
            </TableRow>
        );
    }

    render(){
        const { data, loading } = this.state

        return (
            <div>
                <Loader 
                    loaded={!loading} lines={13} length={20} width={10} radius={30}
                    corners={1} rotate={0} direction={1} color="#000" speed={1}
                    trail={60} shadow={false} hwaccel={false} className="spinner"
                    zIndex={2e9} top="50%" left="50%" scale={1.00}
                    loadedClassName="loadedContent" />

                <RegularCard
                    cardTitle="Listado de Productos por agotarse"
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

export default Notificaciones
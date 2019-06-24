import React from 'react'
import axios from 'axios'
import { UNEXPECTED } from './../dictionary'
import { withStyles } from 'material-ui/styles'

import toastr from 'toastr'
import TableUI from './../components/TableUI'
import Button from 'material-ui/Button'
import Tooltip from 'material-ui/Tooltip'
import { TableCell, TableRow } from 'material-ui/Table'
import { LIST_CLIENTS, DELETE_CLIENTS } from './../routing'
import {
    RegularCard
} from './../components';
import Loader from 'react-loader'

import TrashIcon from '@material-ui/icons/Delete'
import BuildIcon from '@material-ui/icons/Build'
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

const goAdd = () => {
    window.location.href = '/#/clientes/create'
}

const columnData = [
    { id: 'nombre', numeric: false, label: 'Nombre', sortable : true, filterable : true },
    { id: 'email', numeric: false, label: 'Email', sortable : true, filterable : true },
    { id: 'actions', label : 'Acciones', sortable : false }
];

class Clientes extends React.Component {

    state = { data : [], loading : true }

    constructor(props){
        super(props)
        this.delete = this.delete.bind(this)
        this.goEdit = this.goEdit.bind(this)
    }

    componentDidMount(){
        axios.post(LIST_CLIENTS)
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

    delete = (event, item) => {
        event.preventDefault()
    
        if(window.confirm(`¿Estas seguró eliminar el cliente "${item.nombre}"?`)){
            let params = {
                id_cliente : item.id
            }
            axios.post(DELETE_CLIENTS, params)
            .then((r) => {
                if(r.data.status === 200){
                    toastr.success(`Cliente Eliminado`)
                    let _data = this.state.data
                    _data = _data.filter((p) => p.id !== item.id)
                    this.setState({
                        data : _data
                    })
                }else{
                    toastr.error(UNEXPECTED)
                }
            })
        }
    }

    goEdit(event, item){
        event.preventDefault()
        this.props.history.push({
            pathname: '/clientes/edit',
            state : {
                id : item.id
            }
        })
    }

    RowFormat = props => (
        <TableRow
            hover
            tabIndex={-1}
            key={props.id}
        >
            <TableCell>{props.nombre}</TableCell>
            <TableCell>{props.email}</TableCell>
            <TableCell>
                <Tooltip title="Editar">
                    <Button variant="fab" color="primary" aria-label="Build" mini style={styles.button} onClick={(e) => this.goEdit(e, props)}>
                        <BuildIcon />
                    </Button>
                </Tooltip>
                <Tooltip title="Borrar">
                    <Button variant="fab" color="secondary" aria-label="Trash" mini style={styles.button} onClick={(e) => this.delete(e, props)}>
                        <TrashIcon />
                    </Button>
                </Tooltip>
            </TableCell>
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
                    cardTitle="Listado de Clientes"
                    headerColor='red'
                    content = {
                        <div>
                            <Tooltip title="Agregar">
                                <Button variant="fab" color="secondary" aria-label="Add" mini style={{float:'right'}} onClick={goAdd}>
                                    <AddIcon />
                                </Button>
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

export default withStyles(styles)(Clientes);
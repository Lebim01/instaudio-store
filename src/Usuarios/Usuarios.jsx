import React from 'react';
import { withStyles } from 'material-ui/styles';
import { UNEXPECTED } from './../dictionary'
import { LIST_USERS, DELETE_USER } from './../routing'
import axios from 'axios'
import TableUI from './../components/TableUI'
import {
    RegularCard
} from './../components';
import Loader from 'react-loader'

// COMPONENTS
import { TableCell, TableRow } from 'material-ui/Table';
import Button from 'material-ui/Button';
import toastr from 'toastr'
import green from '@material-ui/core/colors/green';

// ICONS 
import Tooltip from 'material-ui/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import BuildIcon from '@material-ui/icons/Build';
import TrashIcon from '@material-ui/icons/Delete';

// BEGIN HEADER

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
    },
    margin: {
        margin: theme.spacing.unit * 2,
    },
    button: {
        margin: theme.spacing.unit,
    },
    buttonRed : {
        backgroundColor : 'red !important'
    },
    buttonGreen : {
        color : theme.palette.getContrastText(green[500]),
        backgroundColor : green[500],
    }
});

const columnData = [
    { id: 'id', numeric: false, label: 'ID', sortable : true, filterable : true },
    { id: 'nombre', numeric: false, label: 'Nombre', sortable : true, filterable : true },
    { id: 'user', numeric: false, label: 'Usuario', sortable : true, filterable : true },
    { id: 'status', numeric: false, label: 'Estatus', sortable : true, filterable : true },
    { id: 'acciones', numeric: false, label: '', sortable : false, filterable : false },
];

class Usuarios extends React.Component {
    state = { data : [], loading : true }

    constructor(props){
        super(props)

        this.goEdit = this.goEdit.bind(this)
        this.goAdd = this.goAdd.bind(this)
        this._delete = this._delete.bind(this)
        this.loadProductos = this.loadProductos.bind(this)
    }

    _delete = (event, item) => {
        event.preventDefault()
        
        this.setState({
            loading : true
        })
        if(window.confirm(`¿Estas seguró eliminar el usuario "${item.nombre}"?`)){
            let params = {
                id : item.id
            }
            axios.post(DELETE_USER, params)
            .then((r) => {
                if(r.data.status === 200){
                    let _data = this.state.data
                    _data = _data.filter((p) => p.id !== item.id)
                    this.setState({
                        data : _data,
                        loading : false
                    })
                    toastr.success(`Usuario Eliminado`)
                }else{
                    toastr.error(UNEXPECTED)
                }
            })
        }
    }

    RowFormat = props => {
        return (
            <TableRow
                hover
                tabIndex={-1}
                key={props.id}
            >
                <TableCell>{props.id}</TableCell>
                <TableCell>{props.nombre}</TableCell>
                <TableCell>{props.user}</TableCell>
                <TableCell>{props.status == 1 ? 'Activo' : 'Inactivo'}</TableCell>
                <TableCell>
                    <Tooltip title="Editar">
                        <Button variant="fab" color="primary" aria-label="Build" mini style={styles.button} onClick={(e) => this.goEdit(e, props)}>
                            <BuildIcon />
                        </Button>
                    </Tooltip>
                    <Tooltip title="Borrar">
                        <Button variant="fab" color="inherit" aria-label="Trash" mini style={{backgroundColor : '#db2b2b', color : 'white'}} onClick={(e) => this._delete(e, props)}>
                            <TrashIcon />
                        </Button>
                    </Tooltip>
                </TableCell>
            </TableRow>
        );
    }

    componentDidMount(){
        this.loadProductos()
    }

    loadProductos(){
        axios.post(LIST_USERS)
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

    goEdit(event, item){
        event.preventDefault()
        this.props.history.push({
            pathname: '/usuarios/edit',
            state : {
                id : item.id
            }
        })
    }

    goAdd(){
        this.props.history.push({
            pathname: '/usuarios/create',
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
                    cardTitle="Listado de Usuarios"
                    headerColor='blue'
                    classes={{
                        cardHeader : 'RegularCard-cardTitle-101'
                    }}
                    content = {
                        <div>
                            <Tooltip title="Agregar">
                                <Button variant="fab" color="inherent" aria-label="Add" mini style={{float:'right', backgroundColor : 'green', color : 'white'}} onClick={this.goAdd}>
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

// END BODY

export default withStyles(styles)(Usuarios);
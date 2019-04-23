import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import "./LineasProductos.css"

// REQUEST
import axios from 'axios'
import { LIST_LINEAS, DELETE_LINEAS } from './../routing'
import { UNEXPECTED } from './../dictionary'


// COMPONENTS
import toastr from 'toastr'
import { TableCell, TableRow } from 'material-ui/Table'
import Button from 'material-ui/Button'
import Tooltip from 'material-ui/Tooltip'
import {
    RegularCard
} from './../components';
import TableUI from './../components/TableUI'
import Loader from 'react-loader'

import TrashIcon from '@material-ui/icons/Delete'
import BuildIcon from '@material-ui/icons/Build'
import AddIcon from '@material-ui/icons/Add'

const columnData = [
    { id: 'nombre', numeric: false, label: 'Nombre', sortable : true, filterable : true },
    { id: 'actions', label : 'Acciones', sortable : false }
];

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
    },
    table: {
        minWidth: 1020,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    button: {
        margin: theme.spacing.unit,
    },
});

// BEGIN BODY

class LineasProductos extends React.Component {
    constructor(props, context) {
        super(props, context);

        // events
        this.delete = this.delete.bind(this)
        this.goEdit = this.goEdit.bind(this)
        this.goAdd = this.goAdd.bind(this)

        this.state = {
            data: [],
            loading : true
        };
    }

    componentDidMount(){
        axios.post(LIST_LINEAS)
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
  
    delete(e, item){
        e.preventDefault()
        if(window.confirm(`¿Estas seguró eliminar la linea de producto "${item.nombre}"?`)){
            let params = {
                id : item.id
            }
            axios.post(DELETE_LINEAS, params)
            .then((r) => {
                if(r.data){
                    let _data = this.state.data
                    _data = _data.filter((p) => p.id !== item.id)
                    this.setState({
                        data : _data
                    })
                    toastr.success(`Linea de Producto Eliminada`)
                }else{
                    toastr.error(UNEXPECTED)
                }
            })
        }
    }

    goEdit(e, item){
        e.preventDefault()
        this.props.history.push({
            pathname: '/lineasproductos/edit',
            state : {
                id : item.id
            }
        })
    }

    goAdd(){
        this.props.history.push({
            pathname: '/lineasproductos/create',
        })
    }

    RowFormat = props => (
        <TableRow
            hover
            tabIndex={-1}
            key={props.id}
        >
            <TableCell>{props.nombre}</TableCell>
            <TableCell>
                <Tooltip title="Editar">
                    <Button variant="fab" color="primary" aria-label="Build" mini className={styles.button} onClick={(e) => this.goEdit(e, props)}>
                        <BuildIcon />
                    </Button>
                </Tooltip>
                <Tooltip title="Borrar">
                    <Button variant="fab" color="inherent" aria-label="Trash" mini className={styles.button} style={{backgroundColor : '#db2b2b', color : 'white'}} onClick={(e) => this.delete(e, props)}>
                        <TrashIcon />
                    </Button>
                </Tooltip>
            </TableCell>
        </TableRow>
    )

    render() {
        const { data, loading } = this.state;
        return (
            <div>
                <Loader loaded={!loading} lines={13} length={20} width={10} radius={30}
                    corners={1} rotate={0} direction={1} color="#000" speed={1}
                    trail={60} shadow={false} hwaccel={false} className="spinner"
                    zIndex={2e9} top="50%" left="50%" scale={1.00}
                    loadedClassName="loadedContent" />

                <RegularCard
                    cardTitle="Listado de Lineas de Productos"
                    headerColor='blue'
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
        );
    }
}

LineasProductos.propTypes = {
    classes: PropTypes.object.isRequired,
};

// END BODY

export default withStyles(styles)(LineasProductos);
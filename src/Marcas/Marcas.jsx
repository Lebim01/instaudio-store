import React from 'react'
import axios from 'axios'
import { withStyles } from 'material-ui/styles'

import TableUI from './../components/TableUI'
import Button from 'material-ui/Button'
import Tooltip from 'material-ui/Tooltip'
import toastr from 'toastr'
import { TableCell, TableRow } from 'material-ui/Table'
import { LIST_MARCAS, DELETE_MARCAS } from './../routing'
import { UNEXPECTED } from './../dictionary'
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

const columnData = [
    { id: 'nombre', numeric: false, label: 'Nombre', sortable : true, filterable : true },
    { id: 'actions', label : 'Acciones', sortable : false }
];

class Marcas extends React.Component {

    state = { data : [], loading : true }

    constructor(props){
        super(props)
        this._delete = this._delete.bind(this)
        this.goEdit = this.goEdit.bind(this)
        this.goAdd = this.goAdd.bind(this)
    }

    componentDidMount(){
        axios.post(LIST_MARCAS)
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

    _delete = (event, item) => {
        event.preventDefault()
    
        if(window.confirm(`¿Estas seguró eliminar la marca "${item.nombre}"?`)){
            let params = {
                id_marca : item.id
            }
            axios.post(DELETE_MARCAS, params)
            .then((r) => {
                if(r.data.status === 200){
                    toastr.success(`Marca Eliminada`)
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
                    <Button variant="fab" color="inherent" aria-label="Trash" mini className={styles.button} style={{backgroundColor : '#db2b2b', color : 'white'}} onClick={(e) => this._delete(e, props)}>
                        <TrashIcon />
                    </Button>
                </Tooltip>
            </TableCell>
        </TableRow>
    )

    goAdd(){
        this.props.history.push({
            pathname : '/marcas/create'
        })
    }

    goEdit(event, item){
        event.preventDefault()
        this.props.history.push({
            pathname: '/marcas/edit',
            state : {
                id : item.id
            }
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
                    cardTitle="Listado de Marcas"
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
        )
    }
}

export default withStyles(styles)(Marcas);
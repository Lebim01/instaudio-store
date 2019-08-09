import React from 'react';
import { withStyles } from 'material-ui/styles';
import { UNEXPECTED } from './../dictionary'
import { LIST_PRODUCTS, CHANGE_STATUS_PRODUCTS, DELETE_PRODUCTS, CHANGE_PRICES, PRICES } from './../routing'
import axios from 'axios'
import TableUI from './../components/TableUI'
import {
    RegularCard
} from './../components';
import Loader from 'react-loader'
import { Button as ButtonReact, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Label, Input } from 'reactstrap';

// COMPONENTS
import { TableCell, TableRow } from 'material-ui/Table';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import toastr from 'toastr'
import green from '@material-ui/core/colors/green';
import swal from 'sweetalert';

// ICONS 
import Tooltip from 'material-ui/Tooltip';
import VisibleIcon from '@material-ui/icons/Visibility';
import VisibleOffIcon from '@material-ui/icons/VisibilityOff';
import BuildIcon from '@material-ui/icons/Build';
import TrashIcon from '@material-ui/icons/Delete';
import ErrorIcon from '@material-ui/icons/Error';
import AddIcon from '@material-ui/icons/Add';
import MoneyIcon from '@material-ui/icons/AttachMoney';
import Swal from 'sweetalert2';

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
    { id: 'image', numeric: false, label: '', sortable : false, filterable : false },
    { id: 'nombre', numeric: false, label: 'Nombre', sortable : true, filterable : true },
    { id: 'linea', numeric: false, label: 'Linea de Producto', sortable : true, filterable : true },
    { id: 'marca', numeric: false, label: 'Marca', sortable : true, filterable : true },
    { id: 'codigo', numeric: false, label: 'Código', sortable : true, filterable : true },
    { id: 'precio_venta', numeric: true, label: '($) Venta', sortable : true },
    { id: 'actions', label : 'Acciones', sortable : false, style : { minWidth : 150 } }
];

class EditarPrecio extends React.Component {

    state = {}

    constructor(props){
        super(props)
        this.onChange = this.onChange.bind(this)
        this.save = this.save.bind(this)
    }

    componentWillReceiveProps(props){
        axios.post(PRICES, { id: props.id_producto })
        .then((r) => {
            let state = {}
            for(let i in r.data){
                let row = r.data[i]
                state[row.tipo.toLowerCase()] = Number(row.precio)
            }
            this.setState({
                ...state
            })
        })
    }

    onChange = name => (e) => {
        this.setState({
            [name] : e.target.value
        })
    }

    save(){
        axios.post(CHANGE_PRICES, { ...this.state, id_producto: this.props.id_producto })
        .then((r) => {
            this.setState({
                mayoreo: 0,
                menudeo: 0,
                semimenudeo: 0
            })
            Swal.fire('Precios', 'Guardados', 'success')
            this.props.toggle()
        })
    }

    render(){
        return (
            <Modal isOpen={this.props.open} toggle={this.props.toggle} className={this.props.className}>
                <ModalHeader toggle={this.props.toggle}>Cambiar de precio</ModalHeader>
                <ModalBody>
                    <Row className="form-group">
                        <Col xs="4">
                            <Label>Mayoreo</Label>
                        </Col>
                        <Col xs="8">
                            <Input className="form-control" type="number" value={this.state.mayoreo} onChange={this.onChange('mayoreo')} />
                        </Col>
                    </Row>
                    <Row className="form-group">
                        <Col xs="4">
                            <Label>Semimenudeo</Label>
                        </Col>
                        <Col xs="8">
                            <Input className="form-control" type="number" value={this.state.semimenudeo} onChange={this.onChange('semimenudeo')} />
                        </Col>
                    </Row>
                    <Row className="form-group">
                        <Col xs="4">
                            <Label>Menudeo</Label>
                        </Col>
                        <Col xs="8">
                            <Input className="form-control" type="number" value={this.state.menudeo} onChange={this.onChange('menudeo')} />
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <ButtonReact color="primary" onClick={this.save}>Guardar</ButtonReact>{' '}
                    <ButtonReact color="secondary" onClick={this.props.toggle}>Cancelar</ButtonReact>
                </ModalFooter>
            </Modal>
        )
    }
}

class Productos extends React.Component {
    state = { data : [], loading : true, modal : { open: false } }

    constructor(props){
        super(props)
        this.goAdd = this.goAdd.bind(this)
        this.goEdit = this.goEdit.bind(this)
        this.toggle = this.toggle.bind(this)
        this._delete = this._delete.bind(this)
        this._changeStatus = this._changeStatus.bind(this)
        this.loadProductos = this.loadProductos.bind(this)
    }

    _changeStatus = (event, item) => {
        event.preventDefault()
    
        let _status = item.visible ? 'ocultar' : 'mostrar';
        if(window.confirm(`¿Estas seguró de ${_status} el producto "${item.nombre}"?`)){
            let params = {
                id_producto : item.id
            }
            this.setState({
                loading : true
            })
            axios.post(CHANGE_STATUS_PRODUCTS, params)
            .then((r) => {
                if(r.data.status === 200){
                    let _data = this.state.data
                    for(let i in _data){
                        let row = _data[i]
                        if(row.id === item.id){
                            row.visible = Number(row.visible) === 1 ? 0 : 1
                        }
                    }

                    this.setState({
                        data : _data,
                        loading : false
                    })
                    toastr.success(`Visbilidad cambiada`)
                }else{
                    toastr.error(UNEXPECTED)
                }
            })
        }
    }

    _delete = (event, item) => {
        event.preventDefault()
        
        this.setState({
            loading : true
        })
        if(window.confirm(`¿Estas seguró eliminar el producto "${item.nombre}"?`)){
            let params = {
                id_producto : item.id
            }
            axios.post(DELETE_PRODUCTS, params)
            .then((r) => {
                if(r.data.status === 200){
                    let _data = this.state.data
                    _data = _data.filter((p) => p.id !== item.id)
                    this.setState({
                        data : _data,
                        loading : false
                    })
                    toastr.success(`Producto Eliminado`)
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
                <TableCell>
                    <img src={props.image} alt="Imagen" height="100"/>
                </TableCell>
                <TableCell>{props.nombre}</TableCell>
                <TableCell>
                    { props.linea_status >= 0
                        ? <span>{props.linea}</span>
                        :   <Tooltip title="Esta linea de producto dada de baja">
                                <Typography color="secondary">
                                    {props.linea} <ErrorIcon/>
                                </Typography>
                            </Tooltip>
                    }
                </TableCell>
                <TableCell>
                    { props.marca_status >= 0
                        ? <span>{props.marca}</span>
                        :   <Tooltip title="Esta marca esta dada de baja">
                                <Typography color="secondary">
                                    {props.marca} <ErrorIcon/>
                                </Typography>
                            </Tooltip>
                    }
                </TableCell>
                <TableCell>{ props.codigo }</TableCell>
                <TableCell numeric>{Math.round(props.precio_venta*1.16*100)/100}</TableCell>
                <TableCell>
                    <Tooltip title="Cambiar Precio de Venta">
                        <Button variant="fab" color="green" aria-label="AttachMoney" mini style={{backgroundColor : 'green', color : 'white'}} onClick={(e) => this.toggle(props.id)}>
                            <MoneyIcon />
                        </Button>
                    </Tooltip>
                    { Number(props.visible) === 1
                        ?   <Tooltip title="Cambiar Estado">
                                <Button variant="fab" color="inherit" aria-label="Visible" mini className={styles.button} onClick={(e) => this._changeStatus(e, props)}>
                                    <VisibleIcon />
                                </Button>
                            </Tooltip>
                        :   <Tooltip title="Cambiar Estado">
                                <Button variant="fab" color="inherit" aria-label="VisibleOff" mini className={styles.button} onClick={(e) => this._changeStatus(e, props)}>
                                    <VisibleOffIcon />
                                </Button>
                            </Tooltip>
                    }
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
        axios.post(LIST_PRODUCTS)
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
            pathname: '/productos/edit',
            state : {
                id : item.id
            }
        })
    }

    goAdd = () => {
        this.props.history.push({
            pathname : '/productos/create'
        })
    }

    toggle(id_producto){
        this.setState({
            modal : {
                ...this.state.modal, 
                id_producto: id_producto,
                open: !this.state.modal.open 
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

                <EditarPrecio {...this.state.modal} toggle={this.toggle} />

                <RegularCard
                    cardTitle="Listado de Productos"
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

export default withStyles(styles)(Productos);
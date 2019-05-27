import React, { Component } from 'react';
import './App.css';

// Admin
import { Admin, Resource } from 'react-admin';
// AUTH PROVIDER
import authProvider from './authProvider'
import { createBrowserHistory as createHistory } from 'history';

// Material-UI components
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { createMuiTheme } from '@material-ui/core/styles';
import { Responsive } from 'react-admin';
import { MenuItem } from 'material-ui/Menu';
import Button from 'material-ui/Button';
import ExitIcon from '@material-ui/icons/PowerSettingsNew';

// -- MODULOS
import LoginPage from './Login'
// Productos
import Productos from './Productos'
import CrearProductos from './CrearProductos'
import ProductosIcon from '@material-ui/icons/LocalGroceryStore';
// Lineas productos
import LineasProductos from './LineasProductos'
import LineasIcon from '@material-ui/icons/List';
import CrearLineas from './CrearLineaProducto'
// Marcas
import Marcas from './Marcas'
import MarcasIcon from '@material-ui/icons/Copyright';
import CrearMarcas from './CrearMarcas'
// Inventario
import InventarioIcon from '@material-ui/icons/Store';
import Inventario from './Inventario'
import CrearInventarioEntrada from './CrearInventarioEntrada'
import VerCompra from './VerCompra'
// Ventas
import VentasIcon from '@material-ui/icons/CreditCard'
import Ventas from './Ventas'
import VerVenta from './VerVenta'
import CrearVenta from './CrearVenta'
// Usuarios
import UsuariosIcon from '@material-ui/icons/SupervisorAccount'
import Usuarios from './Usuarios'
import CrearUsuario from './CrearUsuario'

// notificaciones
import { Notifications, NotificationsActive } from '@material-ui/icons'
import Notificaciones from './Notificaciones'
import axios from 'axios'
import { INVENTARIO_NOTIFIY } from 'routing'
import { store } from 'store';

const theme = createMuiTheme(require('./theme'));
const history = createHistory();

const serviceInventarioMonitor = () => {
    setInterval(consultar, 30 * 1000)
    consultar()
    
    async function consultar(){
        let {data} = await axios.post(INVENTARIO_NOTIFIY)
        let ok = document.getElementById('inventario-ok')
        let nook = document.getElementById('inventario-no-ok')
        if(ok && nook){
            if(data.agotandose > 0){
                nook.classList.remove('hide')
                nook.classList.add('font-red')
                ok.classList.add('hide')
            }else{
                nook.classList.add('hide')
                nook.classList.remove('font-red')
                ok.classList.remove('hide')
            }
        }
    }
}

const NotificatioButon = () => (
    <Responsive
        xsmall={
            <MenuItem
                onClick={()=> {
                    window.location.href = '/notificaciones'
                }}
                style={{color : theme.palette.primary.contrastText }}
            >
                <div id="inventario-ok"><Notifications /></div>
                <div id="inventario-no-ok" className="hide"><NotificationsActive /></div>
            </MenuItem>
        }
        medium={
            <Button
                onClick={()=> {
                    window.location.href = '/notificaciones'
                }}
                style={{color : theme.palette.primary.contrastText }}
                size="small"
            >
                <div id="inventario-ok"><Notifications /></div>
                <div id="inventario-no-ok" className="hide"><NotificationsActive /></div>
                Inventario
            </Button>
        }
    />
)

const LogoutButton = () => (
    <Responsive
        xsmall={
            <MenuItem
                onClick={()=> {
                    store.dispatch({
                        type : 'LOGOUT'
                    })
                    window.location.reload()
                }}
                style={{color : theme.palette.primary.contrastText }}
            >
                <ExitIcon /> Salir
            </MenuItem>
        }
        medium={
            <Button
                onClick={()=> {
                    store.dispatch({
                        type : 'LOGOUT'
                    })
                    window.location.reload()
                }}
                style={{color : theme.palette.primary.contrastText }}
                size="small"
            >
                <ExitIcon /> Salir
            </Button>
        }
    />
);

const TopMenu = () => (
    <div>
        <NotificatioButon />
        <LogoutButton />
    </div>
)

const resources = {
    productos : (
        <Resource 
            name="productos" 
            list={Productos}
            create={CrearProductos}
            edit={CrearProductos}
            icon={ProductosIcon}/>
    ),
    lineas : (
        <Resource 
            name="lineasproductos" 
            list={LineasProductos} 
            create={CrearLineas}
            edit={CrearLineas}
            icon={LineasIcon}
            options={{ label: 'Lineas de Productos' }}/>
    ),
    marcas : (
        <Resource 
            name="marcas" 
            list={Marcas} 
            create={CrearMarcas}
            edit={CrearMarcas}
            icon={MarcasIcon}
            options={{ label: 'Marcas' }}/>
    ),
    inventario : (
        <Resource 
            name="inventario" 
            list={Inventario}
            edit={VerCompra}
            create={CrearInventarioEntrada}
            icon={InventarioIcon}
            options={{ label: 'Inventario' }}/>
    ),
    ventas : (
        <Resource 
            name="ventas" 
            list={Ventas}
            create={CrearVenta}
            edit={VerVenta}
            icon={VentasIcon}
            options={{ label: 'Ventas' }}/>
    ),
    usuarios : (
        <Resource 
            name="usuarios" 
            list={Usuarios}
            create={CrearUsuario}
            edit={CrearUsuario}
            icon={UsuariosIcon}
            options={{ label: 'Usuarios' }}/>
    ),
    notificaciones_inventario : (
        <Resource 
            name="notificaciones" 
            list={Notificaciones}
            icon={Notifications}
            options={{ label: 'Notificaciones inventario' }}/>
    )
}

class App extends Component {

    state = {
        modulos : {
            productos : 'Activo'
        }
    }

    constructor(props){
        super(props)
        this.permisos = this.permisos.bind(this)
    }

    permisos(){
        let state = store.getState()
        if(state.lastAction === 'LOGIN'){
            this.setState({
                modulos : state.modulos || {}
            })
        }
    }

    checkAuth(){
        let state = store.getState()
        if(!state.token){
            history.push({
                pathname : '/login'
            })
        }
    }

    componentDidMount(){
        this.checkAuth()
        serviceInventarioMonitor()
        store.subscribe(this.permisos)
    }

    render() {
        const { modulos } = this.state

        return (
            <div className="App">
                <MuiThemeProvider theme={theme}>
                    <Admin loginPage={LoginPage} theme={theme} title={"Instaudio"} authProvider={authProvider} logoutButton={TopMenu} history={history}>
                        
                        { Object.keys(modulos)
                            .filter(modulo_name => modulos[modulo_name] === 'Activo')
                            .map((modulo_name) => {
                                return resources[modulo_name] 
                            })
                        }

                    </Admin>
                </MuiThemeProvider>
            </div>
        );
    }
}

export default App;
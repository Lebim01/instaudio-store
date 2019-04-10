import React, { Component } from 'react';
import './App.css';

// Admin
import { Admin, Resource } from 'react-admin';
// AUTH PROVIDER
import authProvider from './authProvider'

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
// Ventas
import VentasIcon from '@material-ui/icons/CreditCard'
import Ventas from './Ventas'
import VerVenta from './VerVenta'
import CrearVenta from './CrearVenta'

const theme = createMuiTheme(require('./theme'));

const LogoutButton = ({ userLogout, ...rest }) => (
    <Responsive
        xsmall={
            <MenuItem
                onClick={()=> {
                    localStorage.removeItem('token')
                    window.location.href = '#/login'
                }}
                style={{color : theme.palette.primary.contrastText }}
            >
                <ExitIcon /> Salir
            </MenuItem>
        }
        medium={
            <Button
                onClick={()=> {
                    localStorage.removeItem('token')
                    window.location.href = '#/login'
                }}
                style={{color : theme.palette.primary.contrastText }}
                size="small"
            >
                <ExitIcon /> Salir
            </Button>
        }
    />
);

class App extends Component {

    render() {
        return (
            <div className="App">
                <MuiThemeProvider theme={theme}>
                    <Admin loginPage={LoginPage} theme={theme} title={"Instaudio"} authProvider={authProvider} logoutButton={LogoutButton}>
                        <Resource 
                            name="productos" 
                            list={Productos}
                            create={CrearProductos}
                            edit={CrearProductos}
                            icon={ProductosIcon}/>

                        <Resource 
                            name="lineasproductos" 
                            list={LineasProductos} 
                            create={CrearLineas}
                            edit={CrearLineas}
                            icon={LineasIcon}
                            options={{ label: 'Lineas de Productos' }}/>

                        <Resource 
                            name="marcas" 
                            list={Marcas} 
                            create={CrearMarcas}
                            edit={CrearMarcas}
                            icon={MarcasIcon}
                            options={{ label: 'Marcas' }}/>

                        <Resource 
                            name="inventario" 
                            list={Inventario} 
                            create={CrearInventarioEntrada}
                            icon={InventarioIcon}
                            options={{ label: 'Inventario' }}/>

                        <Resource 
                            name="ventas" 
                            list={Ventas}
                            create={CrearVenta}
                            edit={VerVenta}
                            icon={VentasIcon}
                            options={{ label: 'Ventas' }}/>

                    </Admin>
                </MuiThemeProvider>
            </div>
        );
    }
}

export default App;
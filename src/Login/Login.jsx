import React from 'react'
import './Login.css'
import { LOGIN } from './../routing'
import axios from 'axios'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import Loader from 'react-loader'

const instadio_logo = require('assets/img/instaudio.png')

// Main app
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: true,
            username : '',
            password : '',
            loadin : false
        }
        // Bindings
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeInput = this.onChangeInput.bind(this)

        if(localStorage.getItem('token')) this.redirect()
    }

    onChangeInput(e){
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        const { username, password } = this.state;
        this.setState({loading  : true})
        axios.post(LOGIN, { username, password })
        .then((r) => {
            this.setState({loading  : false})
            if(r.data.status){
                localStorage.setItem('token', r.data.token)
                this.redirect()
            }else{
                toastr.error('Usurio y/o Contraseña invalidos')
            }
        })
    }

    redirect(){
        window.location = '#/productos'
    }

    render() {
        // const for React CSS transition declaration
        let component = this.state.isVisible 
            ? <Modal onSubmit={ this.handleSubmit } onChangeInput={this.onChangeInput} key='modal'/> 
            : <ModalBack onClick={ this.handleRemount } key='bringitback'/>;
        const { loading } = this.state
        return (
            <div className="login">
                <Loader loaded={!loading} lines={13} length={20} width={10} radius={30}
                    corners={1} rotate={0} direction={1} color="#000" speed={1}
                    trail={60} shadow={false} hwaccel={false} className="spinner"
                    zIndex={2e9} top="50%" left="50%" scale={1.00}
                    loadedClassName="loadedContent" />
                { component }
            </div>
        )
    }
}

// Modal
class Modal extends React.Component {
    render() {
        return (
            <div className='Modal'>
                <Logo />
                <form onSubmit= { this.props.onSubmit }>
                    <Input type='text' name='username' placeholder='Usuario' fa="user" onChange={this.props.onChangeInput} />
                    <Input type='password' name='password' placeholder='Contraseña' fa="key" onChange={this.props.onChangeInput} />
                    <button> Ingresar</button>
                </form>
            </div>
        )
    }
}

// Generic input field
class Input extends React.Component {
    render() {
        return ( 
            <div className='Input'>
                <input type={ this.props.type } name={ this.props.name } placeholder={ this.props.placeholder } onChange={this.props.onChange} required autoComplete='off'/>
                <i className={`fa fa-${this.props.fa}`} style={{color: 'white'}}></i>
           </div>
        )
    }
}

// Fake logo
class Logo extends React.Component {
    render() {
        return (
            <div className="logo">
                <img src={instadio_logo} width="200" style={{margin : 15}} />
            </div>
        )
    }
}

// Button to brind the modal back
class ModalBack extends React.Component {
    render() {
        return <button className="bringitback" onClick={ this.props.onClick } key={ this.props.className }>Brind the modal back !</button>
    }
}

export default Login
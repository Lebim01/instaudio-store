import React from 'react'
import {
    Dialog,
    DialogActions,
    DialogContent,
    TextField,
    Grid,
    Button,
    DialogTitle,
}
from '@material-ui/core'
import NumberFormat from 'react-number-format';
import {  } from 'routing'

function NumberFormatCustom(props) {
    const { inputRef, onChange, ...other } = props;
    return (
        <NumberFormat
            {...other}
            ref={inputRef}
            onValueChange={values => {
                onChange({
                    target: {
                        value: values.value,
                    },
                });
            }}
            thousandSeparator
            prefix="$"
        />
    );
}

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: '100%',
        position: 'relative',
        minHeight: 200
    },
    row : {
        paddingTop : 10,
        paddingBottom : 10,
        marginTop : 5
    },
    textField: {
        width : '100%',
        textAlign : 'left'
    },
    formControl : {
        width : '100%'
    },
    paper: {
        padding: theme.spacing.unit
    },
    checkbox: {
        marginBottom: 16,
    },
    checkboxLabel : {
        color : theme.palette.accent.contrastText,
    },
    padding: {
        padding: `0 ${theme.spacing.unit * 2}px`,
    },
    chip: {
        margin: theme.spacing.unit / 2,
    },
});


class DialogAddProduct extends React.Component {
    state = {
        concepto : '',
        precio : ''
    }

    constructor(props){
        super(props)
        this.save = this.save.bind(this)
        this.empty = this.empty.bind(this)
        this.onChange = this.onChange.bind(this)
    }

    componentWillReceiveProps({ open }){
        if(open != this.props.props){
            this.empty()
        }
    }

    empty(){
        this.setState({
            concepto: '',
            precio : ''
        })
    }

    onChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    }

    save(){
        if(this.props.save){
            const { precio, concepto } = this.state
            this.props.save({ precio, concepto })
        }
    }

    render(){
        return (
            <Dialog
                onClose={this.props.close}
                aria-labelledby="customized-dialog-title"
                fullWidth={true}
                maxWidth={'md'}
                open={this.props.open}
            >
                <DialogTitle id="customized-dialog-title" onClose={this.props.close}>
                    Agregar concepto
                </DialogTitle>
                <DialogContent style={{overflowY : 'unset'}}>
                    <Grid container spacing={24} className={styles.row}>
                        <Grid item xs={12} md={6} className={styles.paper}>
                            <TextField
                                label="Concepto"
                                className={styles.textField}
                                value={this.state.concepto}
                                onChange={this.onChange('concepto')}
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} className={styles.paper}>
                            <TextField
                                label="Precio"
                                value={this.state.precio}
                                fullWidth={true}
                                onChange={this.onChange('precio')}
                                placeholder="$"
                                InputProps={{
                                    inputComponent: NumberFormatCustom
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.save} color="primary">
                        Agregar
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default DialogAddProduct
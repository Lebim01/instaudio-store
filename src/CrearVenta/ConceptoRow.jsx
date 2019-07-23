import React from 'react'
import NumberFormat from 'react-number-format';
import {
    DeleteForever,
    AttachMoney,
    NewReleases
} from '@material-ui/icons'
import axios from 'axios'
import {
    Button
} from './../components';
import {
    TextField,
    TableCell, 
    TableRow, 
    Tooltip,
    Fab,
    Select
} from '@material-ui/core'

class ConceptoRow extends React.Component {

    constructor(props){
        super(props)
    }

    render(){
        return (
            <TableRow>
                <TableCell padding={'dense'}>
                    
                </TableCell>
                <TableCell padding={'dense'} style={{width: 200, maxWidth : 200}}>
                    
                </TableCell>
                <TableCell padding={'dense'}>
                    {this.props.concepto}
                </TableCell>
                <TableCell padding={'dense'} style={{width: 100, maxWidth: 100}}>
                    
                </TableCell>
                <TableCell padding={'dense'}>
                    {this.props.precio}
                </TableCell>
                <TableCell padding={'dense'} style={{width: 100, maxWidth: 100}}>
                    <Button size="small" color="inherent" variant="contained" className="danger" style={{color: 'white', backgroundColor : 'red'}} onClick={() => this.props.delete(this.props.index)}>
                        <DeleteForever />
                    </Button>
                </TableCell>
            </TableRow>
        )
    }
}

export default ConceptoRow
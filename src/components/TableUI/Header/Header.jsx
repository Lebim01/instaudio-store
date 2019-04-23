import React from 'react'
import {
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
    Checkbox,
    Tooltip
} from '@material-ui/core';

class Header extends React.Component {
    createSortHandler = property => event => {
        this.props.onRequestSort(event, property);
    };

    onChange(e){
        if(this.props.onChangeFilters){
            this.props.onChangeFilters(e)
        }
    }

    render() {
        const { onSelectAllClick, order, orderBy, numSelected, rowCount, columnData, selectable, filters, SubHeader } = this.props;
        const activeFilters = columnData.filter((c) => c.filterable === true).length > 0

        return (
            <TableHead>
                { SubHeader &&
                    <SubHeader />
                }
                <TableRow>
                    { selectable &&
                        <TableCell padding="checkbox">
                            <Checkbox
                                indeterminate={numSelected > 0 && numSelected < rowCount}
                                checked={numSelected === rowCount}
                                onChange={onSelectAllClick}
                            />
                        </TableCell>
                    }
                    { columnData.map(column => {
                        return (
                        <TableCell
                            key={column.id}
                            numeric={column.numeric}
                            padding={column.padding ? column.padding : column.disablePadding ? 'none' : 'dense'}
                            sortDirection={orderBy === column.id ? order : false}
                            style={column.style || {}}
                            classes={{root:column.className}}
                            colSpan={column.colSpan}
                            rowSpan={column.rowSpan}
                        >
                        { column.sortable 
                            ?   <Tooltip
                                    title="Ordenar"
                                    placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                                    enterDelay={300}
                                >
                                    <TableSortLabel
                                        active={orderBy === column.id}
                                        direction={order}
                                        onClick={this.createSortHandler(column.id)}
                                    >
                                        { column.label }
                                    </TableSortLabel>
                                </Tooltip>
                            : column.label
                        }
                        </TableCell>
                        );
                    }, this)}
                </TableRow>
                { activeFilters &&
                    <TableRow>
                        { columnData.map((column) => 
                            <TableCell key={column.id} padding={column.padding ? column.padding : column.disablePadding ? 'none' : 'dense'}>
                                { column.filterable
                                    ?   <input 
                                            type="text"
                                            className="form-control" 
                                            style={{minWidth: 100}} 
                                            onChange={this.onChange.bind(this)} 
                                            name={column.id}
                                            autoComplete={'off'}
                                            value={filters[column.id] || ''} />
                                    : <div></div>
                                }
                            </TableCell>
                        ) }
                    </TableRow>
                }
            </TableHead>
        );
    }
}

Header.defaultProps = {
    onChangeFilters : () => {}
}

export default Header;
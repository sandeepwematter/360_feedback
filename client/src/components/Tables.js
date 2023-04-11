import React, { useState } from "react";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import '../components/style.css';
import { IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';


export default function AccessibleTable(props) {
    const [hoveredValue, setHoveredValue] = useState("");
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [isHover, setIsHover] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const definationArray = props.definationarray;
    const x = props.allCompetencyValue;
    const len = props.value.length;
    let val = props.value;

    function createData(Parameter, Responses, ...values) {
        const columnNames = [];
        for (let i = 0; i < x.length; i++) {
            columnNames.push(`Column ${i + 1}`);
        }
        const obj = {
            Parameter,
            Responses,
        };
        values.forEach((value, i) => {
            obj[columnNames[i]] = value;
        });
        obj['Total'] = values[values.length - 1]

        return obj;
    }

    const rows = props.value.map((value, index) => {
        const response = props.response[index];
        const val = props.datavalue[index];
        return createData(value, response, ...val);
    });

    function getTableCellColor(x) {
        if (x > 0 && x <= 2.99) {
            return "red";
        } else if (x >= 3 && x < 4.5) {
            return "orange";
        } else {
            return "green";
        }
    }

    function handleCellHover(index) {
        setIsHover(true);
        setHoveredIndex(index);
        setHoveredValue(definationArray[index].defination);
    }

    function handleCellMouseLeave() {
        setIsHover(false)
        setHoveredIndex(null);
        setHoveredValue("");
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    function downloadCsv() {
        const rows1 = [...document.querySelectorAll('table tr')];
        const rows = rows1.filter(user => user.firstChild.textContent === 'Parameter' || val.includes(user.firstChild.textContent) || user.firstChild.textContent === 'Total')
        const csvContent = rows.map((row) => {
            const cols = [...row.querySelectorAll('th,td')];
            return cols.map((col) => col.innerText).join(',');
        }).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'table.csv');
    }

    async function downloadPng() {
        const table = document.querySelector('table');
        const canvas = await html2canvas(table, { backgroundColor: 'white' });
        canvas.toBlob((blob) => {
            saveAs(blob, 'table.png');
        });
    }

    return (
        <>
            <div style={{ marginTop: '0px', textAlign: 'end', }}>
                <IconButton onClick={handleClick}>
                    <DownloadIcon />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={downloadCsv}>
                        <DownloadIcon />
                        Download CSV
                    </MenuItem>
                    <MenuItem onClick={downloadPng}>
                        <PhotoCameraIcon />
                        Download PNG
                    </MenuItem>
                </Menu>
            </div>
            <TableContainer component={Paper} style={{ width: '100%', display: 'flex' }}>
                <Table sx={{ minWidth: 50 }} aria-label="caption table" style={{ width: '100%', height: '100%', border: '1px solid rgb(255,245,215)' }}>
                    <TableHead>
                        <TableRow >
                            <TableCell style={{ fontSize: '21px' }}>Parameter</TableCell>
                            <TableCell align="right" style={{ fontSize: '21px' }}>Responses</TableCell>
                            {props.allCompetencyValue.map((user, index) => (
                                <TableCell
                                    key={index}
                                    style={{ width: '500px', fontSize: '21px', cursor: 'pointer' }}
                                    onMouseEnter={() => handleCellHover(index)}
                                    onMouseLeave={handleCellMouseLeave}
                                >
                                    {user}
                                    {isHover && hoveredIndex === index ? <div className="tooltip">
                                        <span className="tooltiptext">{hoveredValue}</span>
                                    </div> : null}
                                </TableCell>
                            ))}
                            <TableCell style={{ fontSize: '25px', fontWeight: 'bold' }}>Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {rows.map((row, index) => (
                            index + 1 === len ?
                                <TableRow key={index} style={{ fontWeight: 'bold' }}>
                                    <TableCell component="th" scope="row" style={{ fontSize: '25px', fontWeight: 'bold' }}>
                                        {row.Parameter}
                                    </TableCell>
                                    <TableCell align="middle" style={{ fontSize: '20px', fontWeight: 'bold' }}>{row.Responses}</TableCell>
                                    {props.allCompetencyValue.map((_, i) => (
                                        <TableCell
                                            key={i}
                                            align="middle"
                                            style={{
                                                backgroundColor: getTableCellColor(row[`Column ${i + 1}`]),
                                                border: '1px solid white',
                                                fontSize: '20px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {parseFloat(row[`Column ${i + 1}`]).toFixed(2)}
                                        </TableCell>
                                    ))}
                                    <TableCell
                                        align="middle"
                                        style={{
                                            backgroundColor: getTableCellColor(row.Total),
                                            border: '1px solid white',
                                            fontSize: '20px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {parseFloat(row.Total).toFixed(2)}
                                    </TableCell>
                                </TableRow>
                                :
                                <TableRow key={index}>
                                    <TableCell component="th" scope="row" style={{ fontSize: '20px', }}>
                                        {row.Parameter}
                                    </TableCell>
                                    <TableCell align="middle" style={{ fontSize: '20px', }}>{row.Responses}</TableCell>
                                    {props.allCompetencyValue.map((_, i) => (
                                        <TableCell
                                            key={i}
                                            align="middle"
                                            style={{
                                                backgroundColor: getTableCellColor(row[`Column ${i + 1}`]),
                                                border: '1px solid white',
                                                fontSize: '20px',
                                            }}
                                        >
                                            {parseFloat(row[`Column ${i + 1}`]).toFixed(2)}
                                        </TableCell>
                                    ))}
                                    <TableCell
                                        align="middle"
                                        style={{
                                            backgroundColor: getTableCellColor(row.Total),
                                            border: '1px solid white',
                                            fontSize: '20px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {parseFloat(row.Total).toFixed(2)}
                                    </TableCell>
                                </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
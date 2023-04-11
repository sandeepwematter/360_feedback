import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';



export default function AccessibleTable(props) {

    function createData(Num,Parameter, QuestionNo,Value) {
        return { Num,Parameter, QuestionNo,Value};
    }
    let val = props.value;
    let resp = props.response
    let num = props.num;
    let allCompetencyValue = props.allCompetencyValue;
    console.log(val,resp,num)

    const rows = [];
    let i = 1;
    if (resp[6]>=0) {
      rows.push(createData(i, val[parseInt(resp[6] / num)], allCompetencyValue[resp[6] % num], resp[7]));
      i++
    }
    if (resp[8]>=0) {
      rows.push(createData(i, val[parseInt(resp[8] / num)], allCompetencyValue[resp[8] % num], resp[9]));
      i++
    }
    if (resp[10]>=0) {
      rows.push(createData(i, val[parseInt(resp[10] / num)], allCompetencyValue[resp[10] % num], resp[11]));
    }
      console.log(rows)

    return (
        <TableContainer component={Paper}>
      <Table sx={{ minWidth: 550 }} size="small" aria-label="a dense table" style={{ width: '100%', height: '100%' }}>
      <TableHead style={{textAlign: 'center'}}>
        <TableRow>Bottom 3 Smallest Value</TableRow>
      </TableHead>
        <TableHead>
          <TableRow>
            <TableCell>Num</TableCell>
            <TableCell align="">Parameter</TableCell>
            <TableCell align="middle">QuestionNo</TableCell>
            <TableCell align="middle">Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.Num}
              </TableCell>
              <TableCell align="middle">{row.Parameter}</TableCell>
              <TableCell align="middle">{row.QuestionNo}</TableCell>
              <TableCell align="middle">{row.Value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    );
}
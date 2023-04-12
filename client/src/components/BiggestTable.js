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
    console.log(resp)
    const rows = [];
    let i = 1;
    let x = 0;
    if (resp[0]>= 0) {
      rows.push(createData(i, val[parseInt(resp[0] / num)], allCompetencyValue[resp[0] % num], resp[1]));
      i++;
      x++;
    }
    if (resp[2]>=0) {
      rows.push(createData(i, val[parseInt(resp[2] / num)], allCompetencyValue[resp[2] % num], resp[3]));
      i++
      x++;
    }
    if (resp[4]>=0) {
      rows.push(createData(i, val[parseInt(resp[4] / num)], allCompetencyValue[resp[4] % num], resp[5]));
      x++;
    }
    

    return (
        <TableContainer component={Paper}>
      <Table sx={{ minWidth: 550 }} size="small" aria-label="a dense table" style={{ width: '100%', height: '100%' }}>
      <TableHead style={{textAlign: 'center'}}>
        <TableRow>Top {x} Biggest Value</TableRow>
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
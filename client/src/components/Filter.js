import React, { useState } from 'react';
import { Grid } from '@mui/material';

const Filter = (props) => {
    const [checkedFilter,setCheckedFilter] = useState("");
    const handleChange = (e) => {
        const val = props.title
        const { name, checked } = e.target;
        if (name === "allSelect") {
            let tempUser = props.checkedValue.map((user) => {
                return { ...user, isChecked: checked };
            });
            var xyz = {};
            xyz[val.toLowerCase()] = tempUser;
            props.setCheckedValue((abc) => ({
                ...abc, ...xyz
            }));
        } else {
            let tempUser = props.checkedValue.map((user) =>
                user.name === name ? { ...user, isChecked: checked } : user
            );
            var xyz = {};
            xyz[val.toLowerCase()] = tempUser;
            props.setCheckedValue((abc) => ({
                ...abc, ...xyz
            }));
        }
    };
    const onChange = (event) => {
        setCheckedFilter(event.target.value)
    }
    return (
        <>
            <Grid className="container my-4 text-center" style={{
                marginLeft: '0px', height: '100%', width: '20%',
                color: 'black', fontSize: '15px', display: 'flex', backgroundColor: 'rgb(161, 163, 164)', borderRadius: '2px'
            }}>
                <Grid style={{
                    margin: '30px 20px', padding: '2px 2px', border: '1px solid gray', width: '180px',
                    height: '270px', backgroundColor: 'white', fontSize: '20px', borderRadius: '8px'
                }}>
                    <form className="form w-100">
                        <Grid style={{
                            height: '40px', margin: '-2px -2px 0px -2px', padding: '2px 2px',
                            backgroundColor: 'rgb(0, 106, 255)', color: 'white', textAlign: 'center',
                            borderRadius: '4.4px 4.4px 0 0'
                        }}>
                            <h2 style={{ margin: '2px 0 0 -15px', textAlign: 'center', fontSize: '22px' }}>{props.title}</h2>
                        </Grid>
                        <Grid style={{ width: '180px', marginTop: '-2.5px' }}>
                            <input type='text' className="centered-placeholder" placeholder='Type Function here'
                                onChange={onChange} style={{
                                    margin: '-2px -2px 0px -2.5px', width: '180px', height: '30px',
                                    textAlign: 'center', border: '1px solid gray'
                                }}></input>
                        </Grid>
                        <Grid className="form-check" style={{ margin: '5px 5px', padding: '2px 2px', borderRadius: '2px' }}>
                            <input
                                type="checkbox"
                                className="form-check-input"
                                name="allSelect"
                                checked={!props.checkedValue.some((user) => user?.isChecked !== true)}
                                onChange={handleChange}
                            />
                            <label className="form-check-label ms-2">All Select</label>
                        </Grid>
                        <Grid style={{ margin: '5px 0px 0px 20px', height: '150px', overflow: 'scroll' }}>
                            {props.checkedValue.filter((x) => x.name.toLowerCase().startsWith(checkedFilter.toLowerCase())).map((user, index) => (
                                <Grid className="form-check" key={index}>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        name={user.name}
                                        checked={user?.isChecked || false}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label ms-2">{user.name}</label>
                                </Grid>
                            ))}
                        </Grid>
                    </form>
                </Grid>
            </Grid>
        </>
    )
}

export default Filter
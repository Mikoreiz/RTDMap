import React, { Fragment, useState, useEffect } from 'react'
import axios from 'axios'
import './styles/Form.css'

const Form = ({ handleSelect }) => {

    const [data, setData] = useState([])

    useEffect(() => {
        const getData = async () => {
            await axios.get("../json/route_list/routes.json")
            .then((res) => {setData(res.data)})
            .catch((e) => {
                console.log(e)
            })
        }
        getData()
    }, [])

    const handleSelection = (e) => {
        handleSelect(e.target.value)
    }

    return (
        <Fragment>            
            <form className="form">
                <label className='label'>Choose A Route: </label>
                <select onChange={handleSelection}>
                    { data.routes ? (
                            data.routes.map((route) => (
                                <option value={route.id} key={route.id}>{route.id}&nbsp;&nbsp;&nbsp;{route.longName}</option>
                                ))
                    )  : (
                        <option data-testid="noRoutes" value={"1"}>No routes available</option>
                    )}
                </select>
            </form>
        </Fragment>
    )
}

export default Form
import { useState, useEffect } from "react";
import BackButton from "../components/BackButton";
import { Link } from "react-router-dom";


const Menu = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchMenuItems = async()=>{
            try {
                const res = await fetch("http://localhost:5000/menuitems");
                if (!res.ok) throw new Error("Failed to fetch menu items");
                const data = await res.json();
                setMenuItems(data);
             } catch (error) {
                setError(error.message)
             }
            };
            fetchMenuItems();
        }, []);

        const renderTableRows = () =>
            menuItems.map((entry) => (
                <tr key={entry.id}>
                <td><Link to={`/menu/${entry.id}`}>{entry.id}</Link></td>
                <td>{entry.species}</td>
                <td>${entry.pricePerLb.toFixed(2)}</td>
                <td>{entry.timeOfCatch.replace(/(@|T)/, ' ')}</td>
               
                <td>{entry.fisher}</td>
                </tr>
            ));

  return (
    <>
    <div className="newpage">
    <h1 className="menutitle">Fish For Sale:</h1>
    <p>(Select Item# to make purchase)</p>
      <div className="menutable-container">
        <table className="menutable" id="fishTable">
            <thead>
                <tr>
                    <th>Item#</th>
                    <th>Species</th>
                    <th>Price (per lb)</th>
                    <th>Time of Catch</th>
                    
                    <th>Fisher</th>
                </tr>
            </thead>
            <tbody>
            {renderTableRows()} 
            </tbody>
        </table>
        </div>



    </div>
    
    
    <BackButton />
    </>
    )
    }

export default Menu

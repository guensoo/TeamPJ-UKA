import { useState } from "react";
import { Link } from "react-router-dom";
import './MainHeader.css';

const DropDownMenu = ({ title, to, items }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="header-dropdown"
             onMouseEnter={() => setOpen(true)}
             onMouseLeave={() => setOpen(false)}
        >
            <span className="header-dropdown-title">
                <Link to={to}>{title}</Link>
                <span className="arrow">▼</span>
            </span>
            {open && (
                <div className="header-dropdown-menu">
                    {items.map((item, idx) => (
                        <Link key={idx} to={item.to}>{item.label}</Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DropDownMenu;

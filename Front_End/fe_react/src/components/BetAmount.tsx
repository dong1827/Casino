import React, { FC, useEffect, useState } from 'react';


interface BetAmountProps {
    amount: number;
    changeAmount: (newAmount: number) => void; 
}

const BetAmount: FC<BetAmountProps> = ({amount, changeAmount}) => {
    const [input, setInput] = useState(0)

    useEffect(() => { 
        setInput(amount)
    }, [amount]);

    const handleChange = (e) => {
        const value = e.target.value;
        setInput(value);
        changeAmount(value);
    }
    return (
        <div className="columnFlex">
            <label htmlFor='amount'>Please enter the amount of the points you want to bet</label>
            <input
                type = "number"
                value={input}
                onChange={handleChange}
                required
                min="0"
                step="1"
            />
        </div>
    );
}

export default BetAmount;
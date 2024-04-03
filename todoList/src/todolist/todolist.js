import React, {useState, useRef} from 'react';
import taskList from './taskList';
import './todolist.css';


const TodoList = () => {
    const [basketList, setBasketList] = useState(taskList);
    const [fruitList, setFruitList] = useState([]);
    const [vegetableList, setVegetableList] = useState([]);
    const timeToRemove = 5000;
    const keepTimeOut = useRef([]);

    const addItemToList = (index) => {
        const addedItem = basketList[index];
        const setList = addedItem.type === 'Fruit' ? setFruitList : setVegetableList;   

        // add to each basket
        setList(prev => [...prev, addedItem]);
        setBasketList(prev => {
            const updatedBasketList = [...prev];
            updatedBasketList.splice(index, 1);
            return updatedBasketList;
        });

        // add auto remove
        autoRemoveItem(addedItem, setList)
    }

    const removeItemFromList = (indexRemove, type) => {
        const setList = type === 'fruit' ? setFruitList : setVegetableList;        
        setList(prev => {
            const removedItem = prev[indexRemove];
            const updatedList = prev.filter((_, index) => index !== indexRemove);
            setBasketList(prevBasketList => [...prevBasketList, removedItem]);
            removeTimeout(removedItem);
            return updatedList;
        });
    };


    const autoRemoveItem = (addedItem, setList) => {
        const timeoutId = setTimeout(() => {
            setBasketList(prev => [...prev, addedItem]);
            setList(prev => prev.filter(item => item !== addedItem));
            removeTimeout(addedItem);
        }, timeToRemove);

        // เก็บ timeout id ไว้ใน keepTimeOut
        keepTimeOut.current.push({ timeout: timeoutId, item: addedItem });
    }

    const removeTimeout = (item) => {
        const timeoutIndex = keepTimeOut.current.findIndex(ref => ref.item === item);
        if (timeoutIndex !== -1) {
            clearTimeout(keepTimeOut.current[timeoutIndex].timeout);
            keepTimeOut.current.splice(timeoutIndex, 1);
        }
    }
    

    return (
        <div id="todoList">
            <div className='basketAll'>
                {basketList.map((item, index)=>{
                        return (
                            <div key={index} className='itemContainer' onClick={()=>addItemToList(index)}>
                                <p>{item.name}</p>
                            </div>
                        )
                })}
            </div>
            <div className='basket'>
                <p className='headerText'>Fruit</p>                
                {fruitList?.map((fruit, index)=>{
                        return (
                            <div key={index} className='itemContainer' onClick={()=>removeItemFromList(index, 'fruit')}>
                                    <p>{fruit.name}</p>
                            </div>
                        )
                })}                
            </div>
            <div className='basket'>
                <p className='headerText'>Vegetable</p>
                {vegetableList?.map((fruit, index)=>{
                        return (
                            <div key={index} className='itemContainer' onClick={()=>removeItemFromList(index, 'vegetable')}>
                                    <p>{fruit.name}</p>
                            </div>
                        )
                })}
            </div>
        </div>
    )
}

export default TodoList
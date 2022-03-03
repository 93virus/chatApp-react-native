import React, { useState, createContext } from "react";

export const UserContext = createContext();

const UserContextProvider = (props) => {

    const [user, setUser] = useState(null);

    const saveUser = (user) => {
        setUser(user)
    }

    return(
        <UserContext.Provider value={{user, saveUser}}>
            {props.children}
        </UserContext.Provider>
    )

}

export default UserContextProvider;
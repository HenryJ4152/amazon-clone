import React, { createContext, useContext, useReducer } from "react"

// prepares the dataLayer
export const StateContext = createContext()

//wraps app and provide the data layer
export const StateProvider = ({ reducer, initialState, children }) => (
    <StateContext.Provider value={useReducer(reducer, initialState)}>
        {children}
    </StateContext.Provider>
)

//pull info from data layer
export const useStateValue = () => useContext(StateContext)
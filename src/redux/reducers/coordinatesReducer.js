const cardsReducer = (state = [], action) => {
    if(action.type==='SET_COORDINATES') {
        return action.payload;
    }
    return state;
  };
  
  export default cardsReducer;
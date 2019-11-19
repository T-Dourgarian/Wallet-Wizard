const cardsReducer = (state = [], action) => {
    if(action.type==='SET_CARDS') {
        return action.payload;
    }
    return state;
  };
  
  export default cardsReducer;
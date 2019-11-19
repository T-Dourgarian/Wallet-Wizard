
const searchCardsReducer = (state = [], action) => {
    if(action.type==='SEARCH_CARDS') {
        return action.payload.data.filter(card => card.location.toLowerCase().includes(action.payload.searchString.toLowerCase()));
    } else if (action.type === "SET_CARDS") {
        return action.payload
    }
    return state;
  };
  
  export default searchCardsReducer;
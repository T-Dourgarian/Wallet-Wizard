
const searchCardsReducer = (state = [], action) => {
    if(action.type==='SEARCH_CARDS') {
        return action.payload.data.filter(card => card.type.includes(action.payload.type) && action.payload.searchString && card.location.toLowerCase().includes(action.payload.searchString.toLowerCase()));
    } else if (action.type === "SET_CARDS") {
        return action.payload
    }
    return state;
  };
  
  export default searchCardsReducer;
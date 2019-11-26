import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_USER" actions
function* getCards() {
  try {
    const cards = yield axios.get("/cards");
    yield put({type:"SET_CARDS",payload:cards.data});
    
    yield put({ type: "GET_COORDINATES",payload:cards.data });
  } catch (error) {
    console.log('Cards get request failed', error);
  }
}

function* cardsSaga() {
  yield takeLatest('GET_CARDS', getCards);
}

export default cardsSaga;

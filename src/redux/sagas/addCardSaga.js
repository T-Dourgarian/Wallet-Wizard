import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_USER" actions
function* addCard(action) {
  try {
    yield axios.post("/cards",action.payload);
    yield put({type:"GET_CARDS"});
  } catch (error) {
    console.log('card add request failed', error);
  }
}

function* addCardSaga() {
  yield takeLatest('ADD_CARD', addCard);
}

export default addCardSaga;

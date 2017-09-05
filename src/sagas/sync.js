import { takeLatest, call, put } from 'redux-saga/effects'
import {
  sync,
  syncRequest,
  syncSuccess,
  syncFailure,
  setPendingChangesFlag
} from '../actions/ui/sync'
import {
  saveAccountSuccess,
  removeAccountSuccess
} from '../actions/entities/accounts'
import { saveTransactionSuccess } from '../actions/entities/transactions'
import { loadAccountsSaga } from './accounts'
import { loadTagsSaga } from './tags'
import { loadRecentTransactionsSaga } from './transactions'
import AccountsStorage from '../util/storage/accounts'
import TransactionsStorage from '../util/storage/transactions'
import TagsStorage from '../util/storage/tags'

export function* syncSaga() {
  yield put(syncRequest())
  try {
    yield call(AccountsStorage.sync)
    yield loadAccountsSaga()
    yield call(TransactionsStorage.sync)
    yield loadRecentTransactionsSaga()
    yield call(TagsStorage.sync)
    yield loadTagsSaga()
    yield put(syncSuccess())
  } catch (error) {
    yield put(syncFailure(error))
  }
}

export function* setPendingChangesFlagSaga() {
  yield put(setPendingChangesFlag())
}

export default [
  takeLatest(sync, syncSaga),
  takeLatest(saveAccountSuccess, setPendingChangesFlagSaga),
  takeLatest(removeAccountSuccess, setPendingChangesFlagSaga),
  takeLatest(saveTransactionSuccess, setPendingChangesFlagSaga)
]
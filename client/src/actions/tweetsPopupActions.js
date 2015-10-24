'use strict';

var Dispatcher = require('../dispatcher/appDispatcher.js'),
    ActionTypes = require('../constants/actionTypes.js');

var InitializeActions = {
  closePopup: function() {
    Dispatcher.dispatch({
      actionType: ActionTypes.CLOSE_POPUP
    });
  }
};

module.exports = InitializeActions;

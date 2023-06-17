import {AlertsActions} from '../actions/alerts';

export interface Alert {
  id: number;
  account_id: number | null;
  thing_id: number | null;
  start_datetime: string | null;
  end_datetime: string | null;
  status: string;
  created_at: string | null;
  updated_at: string | null;
  state: string | null;
  alert_type: string | null;
  icon_url: string | null;
  floorplan_url: string | null;
  icon_code: string | null;
  icon_name: string | null;
  thing_code: string | null;
  thing_name: string | null;
  details: string | null;
  photo: any | null;
  photo_url: any | null;
  category: string | null;
}

export interface AlarmPopUp {
  showAlarmPopUp: boolean;
  alert: Alert | null;
}

export interface AlertsState {
  allAlerts: Alert[];
  isLoading: boolean;
  alarmPopUp: AlarmPopUp;
}

const initialState = {
  allAlerts: [],
  isLoading: false,
  alarmPopUp: {showAlarmPopUp: false, alert: null},
};

export const alertsReducer = (
  state: AlertsState = initialState,
  action: AlertsActions,
) => {
  switch (action.type) {
    case '@@alerts/LOAD_ALL_ALERTS':
      return {
        ...state,
        allAlerts: action.alerts,
      };

    case '@@alerts/ALERT_IS_LAODING':
      const alertIsLoading = action.isLoading;
      return {
        ...state,
        isLoading: alertIsLoading,
      };

    case '@@alerts/CLEAR_ALERTS':
      return initialState;

    case '@@alerts/LOAD_LATEST_ALERT':
      return {
        ...state,
        alarmPopUp: {
          showAlarmPopUp: action.showAlarmPopUp,
          alert: action.alert,
        },
      };

    default:
      return state;
  }
};

import * as actions from './actions'

const STORED_SETTINGS = (storedSettings: object) => {
  const settings = {}
  Object.keys(storedSettings).forEach(key => {
    const item = JSON.parse(localStorage.getItem(`app.settings.${key}`))
    settings[key] = item === null ? storedSettings[key] : item
  })
  return settings
}

export const initialState: object = {
  // default settings, if not exist in localStorage
  ...STORED_SETTINGS({
    isMobileView: false,
    isTabletView: false,
    isMobileMenuOpen: false,
    isLightTheme: true,
    isSettingsOpen: false,
    isMenuTop: false,
    isMenuCollapsed: false,
    isBorderless: true,
    isSquaredBorders: false,
    isFixedWidth: false,
    isMenuShadow: true,
  }),
}

export function reducer(state = initialState, action: actions.Actions): object {
  switch (action.type) {
    case actions.SET_STATE:
      const key = Object.keys(action.payload)[0]
      window.localStorage.setItem(`app.settings.${key}`, action.payload[key])
      return { ...state, ...action.payload }
    default:
      return state
  }
}

export const getSettings = (state: any) => state

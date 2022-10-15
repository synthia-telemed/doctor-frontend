import { Provider } from 'react-redux'
import { init } from '@rematch/core'
import * as models from '../models'
import App from 'next/app'
import 'rsuite/dist/rsuite.min.css'
import '../styles/globals.css'

const store = init({
  models
})

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}

MyApp.getInitialProps = async appContext => {
  const appProps = await App.getInitialProps(appContext)
  return { ...appProps }
}

export default MyApp

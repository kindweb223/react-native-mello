//-------------------------------------------------------------------------------------------------
// Create a singleton instance of the bugsnag client so we don't have to duplicate our configuration
// anywhere.
//-------------------------------------------------------------------------------------------------
// https://docs.bugsnag.com/platforms/react-native/#basic-configuration
import { Client, Configuration  } from 'bugsnag-react-native'
import { BUGSNAG_KEY } from '../service/api'

const config = new Configuration(BUGSNAG_KEY);
config.appVersion = require('../../package.json').version;
config.consoleBreadcrumbsEnabled = true
const client = new Client(config);
//-------------------------------------------------------------------------------------------------
export default client;
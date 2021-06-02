import './App.css';
import PageContainer from './component/PageContainer'

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

var BACKEND_URL = isLocalhost?"http://localhost:3001":"" //

function App() {
  return (
    <>
      <PageContainer apiUrl={BACKEND_URL + "/"}/>
    </>
  );
}

export default App;

(function(window) {
  const env = {
    local: {
      API_BASE_URL: 'http://localhost:8080',
    },
    dev: {
      API_BASE_URL: 'http://dev.scm.india:8080',
    },
    homol: {
      API_BASE_URL: 'http://homol.scm.india:8080',
    },
    prod: {
      API_BASE_URL: '',
    },
  };

  const getEnv = () => {
    const hostname = window.location.hostname;
    if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      return 'local';
    } else if (hostname.includes('dev')) {
      return 'dev';
    } else if (hostname.includes('homol')) {
      return 'homol';
    } else {
      return 'prod';
    }
  };

  const currentEnv = getEnv();
  window.config = { ...env[currentEnv] };
})(window);
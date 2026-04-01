(function(window) {
  const env = {
    local: {
      API_BASE_URL: 'http://localhost:8080',
    },
    dev: {
      SCM_END_POINT: 'http://dev.scm.india:8080',
    },
    homol: {
      SCM_END_POINT: 'http://homol.scm.india:8080',
    },
    prod: {
      // Production environment settings
    },
  };

  // Determine the current environment based on the hostname
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

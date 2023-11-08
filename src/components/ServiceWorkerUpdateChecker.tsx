import { useState, useEffect } from 'react';

export function ServiceWorkerUpdateChecker() {
  const { swControllerExists, updateAvailable, handleUpdate } = useServiceWorkerUpdateController();

  const nonImportantTextStyle: React.CSSProperties = { margin: 0, fontSize: '75%' };
  const wrapperStyle: React.CSSProperties = { marginTop: '2rem' };

  if (!swControllerExists) {
    return (
      <div style={wrapperStyle}>
        <p style={nonImportantTextStyle}>
          Service worker does not exist — probably running locally
        </p>
      </div>
    );
  }

  return (
    <div style={wrapperStyle}>
      {updateAvailable ? (
        <>
          <p style={{ margin: 0 }}>Update available!</p>
          <button type="button" onClick={handleUpdate} style={{ marginTop: '0.5rem' }}>
            Update
          </button>
        </>
      ) : (
        <p style={nonImportantTextStyle}>No updates available.</p>
      )}
    </div>
  );
}

function useServiceWorkerUpdateController() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const swControllerExists = !!('serviceWorker' in navigator && navigator.serviceWorker.controller);

  useEffect(() => {
    /** Check for service worker updates */
    const checkForUpdates = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration?.waiting) {
            setUpdateAvailable(true);
          }
        } catch (error) {
          console.error('Error checking for service worker updates:', error);
        }
      }
    };

    checkForUpdates();
  }, []);

  const handleUpdate = () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      // Send a message to the service worker to skip waiting and activate the new version
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
      setUpdateAvailable(false);
    }
  };

  return {
    swControllerExists,
    updateAvailable,
    handleUpdate,
  };
}

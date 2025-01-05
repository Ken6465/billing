// historyManager.js
const HistoryManager = () => {
    const [billingHistory, setBillingHistory] = React.useState([]);
    const [isOnline, setIsOnline] = React.useState(navigator.onLine);
    const [syncStatus, setSyncStatus] = React.useState('synced');

    React.useEffect(() => {
        loadBillingHistory();
        window.addEventListener('online', handleOnlineStatus);
        window.addEventListener('offline', handleOnlineStatus);
        
        return () => {
            window.removeEventListener('online', handleOnlineStatus);
            window.removeEventListener('offline', handleOnlineStatus);
        };
    }, []);

    const handleOnlineStatus = () => {
        setIsOnline(navigator.onLine);
        if (navigator.onLine) {
            syncData();
        }
    };

    const loadBillingHistory = () => {
        const history = JSON.parse(localStorage.getItem('billingHistory')) || [];
        setBillingHistory(history);
    };

    const clearHistory = () => {
        if (confirm('Are you sure you want to clear all billing history?')) {
            localStorage.removeItem('billingHistory');
            setBillingHistory([]);
        }
    };

    const exportHistory = () => {
        const dataStr = JSON.stringify(billingHistory, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `billing-history-${new Date().toISOString().slice(0, 10)}.json`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const syncData = () => {
        setSyncStatus('syncing');
        setTimeout(() => {
            setSyncStatus('synced');
        }, 1000);
    };

    return (
        <div className="card bg-glass">
            <div className="card-body px-4 py-5 px-md-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="h4 mb-0">Billing History</h2>
                    <div className="d-flex gap-2">
                        <button 
                            className="btn btn-primary"
                            onClick={exportHistory}
                            disabled={billingHistory.length === 0}
                        >
                            Export History
                        </button>
                        <button 
                            className="btn btn-danger"
                            onClick={clearHistory}
                            disabled={billingHistory.length === 0}
                        >
                            Clear History
                        </button>
                    </div>
                </div>

                <div className="history-list">
                    {billingHistory.length === 0 ? (
                        <p className="text-center text-muted">No billing history available</p>
                    ) : (
                        billingHistory.map((entry, index) => (
                            <div key={index} className="card mb-3">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h5 className="card-title">{entry.room}</h5>
                                            <p className="card-text text-muted">{entry.billingMonth}</p>
                                        </div>
                                        <div className="text-end">
                                            <h6 className="mb-0">₱{parseFloat(entry.totalBill).toLocaleString('en-US', { minimumFractionDigits: 2 })}</h6>
                                            <small className="text-muted">{entry.kWhUsed} kWh</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )).reverse()
                    )}
                </div>
            </div>
        </div>
    );
};

// Initialize the History Manager
const root = ReactDOM.createRoot(document.getElementById('historyManager'));
root.render(React.createElement(HistoryManager));
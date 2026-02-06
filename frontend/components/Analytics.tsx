export default function Analytics() {
    return (
        <div className="bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Analytics</h2>
            
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-4">Traffic Overview</h3>
                    <div className="h-48 bg-gray-900 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">Chart visualization would appear here</p>
                    </div>
                </div>
                
                <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-4">Recent Activities</h3>
                    <div className="space-y-3">
                        {['User login from NY', 'API request processed', 'Threat scan completed', 'System backup'].map((activity, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                                <span className="text-gray-300">{activity}</span>
                                <span className="text-sm text-gray-500">2 min ago</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
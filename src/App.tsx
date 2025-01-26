import React, { useState } from 'react';
import { ChatInterface } from './components/ChatInterface';
import { Visualization } from './components/Visualization';
import { EnvironmentalData } from './types';
import { Sun, Wind, Mountain, Thermometer } from 'lucide-react';

function App() {
  const [environmentalData, setEnvironmentalData] = useState<EnvironmentalData | undefined>();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Environmental Analysis Assistant
          </h1>
          <p className="text-gray-400">
            Analyze environmental factors with AI-powered insights and 3D visualization
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-[600px] rounded-xl overflow-hidden bg-black/40 backdrop-blur-sm border border-gray-800">
            <Visualization data={environmentalData} />
          </div>
          
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="group bg-black/40 backdrop-blur-sm p-4 rounded-xl border border-gray-800 transition-all duration-300 hover:bg-black/60 hover:border-blue-500/50 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Sun className="text-yellow-400 group-hover:text-yellow-300 transition-colors" />
                  <h3 className="font-semibold text-white">Sun Path</h3>
                </div>
                <p className="text-sm text-gray-400">
                  Azimuth: {environmentalData?.sunPath?.azimuth || 'N/A'}°
                  <br />
                  Elevation: {environmentalData?.sunPath?.elevation || 'N/A'}°
                </p>
              </div>
              
              <div className="group bg-black/40 backdrop-blur-sm p-4 rounded-xl border border-gray-800 transition-all duration-300 hover:bg-black/60 hover:border-blue-500/50 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Wind className="text-blue-400 group-hover:text-blue-300 transition-colors" />
                  <h3 className="font-semibold text-white">Wind</h3>
                </div>
                <p className="text-sm text-gray-400">
                  Direction: {environmentalData?.wind?.direction || 'N/A'}
                  <br />
                  Speed: {environmentalData?.wind?.speed || 'N/A'} m/s
                </p>
              </div>
              
              <div className="group bg-black/40 backdrop-blur-sm p-4 rounded-xl border border-gray-800 transition-all duration-300 hover:bg-black/60 hover:border-blue-500/50 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Mountain className="text-green-400 group-hover:text-green-300 transition-colors" />
                  <h3 className="font-semibold text-white">Elevation</h3>
                </div>
                <p className="text-sm text-gray-400">
                  Height: {environmentalData?.elevation?.height || 'N/A'}m
                  <br />
                  Slope: {environmentalData?.elevation?.slope || 'N/A'}°
                </p>
              </div>
              
              <div className="group bg-black/40 backdrop-blur-sm p-4 rounded-xl border border-gray-800 transition-all duration-300 hover:bg-black/60 hover:border-blue-500/50 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Thermometer className="text-red-400 group-hover:text-red-300 transition-colors" />
                  <h3 className="font-semibold text-white">Climate</h3>
                </div>
                <p className="text-sm text-gray-400">
                  Temperature: {environmentalData?.climate?.temperature || 'N/A'}°C
                  <br />
                  Humidity: {environmentalData?.climate?.humidity || 'N/A'}%
                </p>
              </div>
            </div>

            <div className="h-[400px]">
              <ChatInterface onDataUpdate={setEnvironmentalData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
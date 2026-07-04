import React from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { mockAnalyticsData } from '../data/mockData.js';

const Analytics = () => {
  const dailyStats = mockAnalyticsData.dailyStats;
  const regionStats = mockAnalyticsData.regionStats;
  const sourceStats = mockAnalyticsData.sourceStats;
  const topTopics = mockAnalyticsData.topTopics;

  const COLORS = ['#10b981', '#ef4444', '#6b7280'];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics & Insights</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-4">
          <h2 className="text-lg font-bold mb-4">Daily Stats Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="articles" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="mentions" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4">
          <h2 className="text-lg font-bold mb-4">Sentiment Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Positive', value: dailyStats.reduce((sum, d) => sum + d.positive, 0) },
                  { name: 'Negative', value: dailyStats.reduce((sum, d) => sum + d.negative, 0) },
                  { name: 'Neutral', value: dailyStats.reduce((sum, d) => sum + d.neutral, 0) }
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4">
        <h2 className="text-lg font-bold mb-4">Articles by Region</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={regionStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="region" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="articles" fill="#3b82f6" />
            <Bar dataKey="engagement" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-4">
          <h2 className="text-lg font-bold mb-4">Top News Sources</h2>
          <div className="space-y-3">
            {sourceStats.map((source, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="font-medium text-sm">{source.source}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${(source.reach / Math.max(...sourceStats.map(s => s.reach))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 w-12">{source.reach.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4">
          <h2 className="text-lg font-bold mb-4">Trending Topics</h2>
          <div className="space-y-3">
            {topTopics.map((topic, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium flex-1">{topic.topic}</span>
                  <span className={`text-xs ${topic.trend === 'up' ? 'text-green-600' : 'text-red-600'} font-semibold`}>
                    {topic.trend === 'up' ? '↑' : '↓'}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{topic.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

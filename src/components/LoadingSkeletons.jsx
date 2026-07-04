import React from 'react';

export const NewsCardSkeleton = () => {
  const theme = 'light'; // We'll match this dynamically later

  return (
    <div className="rounded-lg overflow-hidden shadow-md bg-white animate-pulse">
      <div className="h-48 bg-gray-300"></div>
      <div className="p-4">
        <div className="flex justify-between mb-2">
          <div className="h-4 bg-gray-300 rounded w-20"></div>
          <div className="h-4 bg-gray-300 rounded w-16"></div>
        </div>
        <div className="h-5 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 rounded mb-3"></div>
        <div className="flex justify-between">
          <div className="h-3 bg-gray-300 rounded w-20"></div>
          <div className="flex space-x-4">
            <div className="h-3 bg-gray-300 rounded w-16"></div>
            <div className="h-3 bg-gray-300 rounded w-16"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NewsGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <NewsCardSkeleton key={index} />
      ))}
    </div>
  );
};

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-gray-200 rounded-xl p-4 shadow-md animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-300 rounded w-16"></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="h-5 bg-gray-300 rounded w-32 mb-4"></div>
            <NewsGridSkeleton />
          </div>
        </div>
        <div>
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="h-5 bg-gray-300 rounded w-24 mb-4"></div>
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-4"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const PostCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div className="h-4 bg-gray-300 rounded w-20"></div>
        </div>
        <div className="h-4 bg-gray-300 rounded w-16"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 rounded"></div>
        <div className="h-3 bg-gray-300 rounded w-32"></div>
      </div>
      <div className="flex items-center justify-between mt-3">
        <div className="flex space-x-4">
          <div className="h-3 bg-gray-300 rounded w-16"></div>
          <div className="h-3 bg-gray-300 rounded w-16"></div>
        </div>
        <div className="h-3 bg-gray-300 rounded w-12"></div>
      </div>
    </div>
  );
};

export default {
  NewsCardSkeleton,
  NewsGridSkeleton,
  DashboardSkeleton,
  PostCardSkeleton,
};

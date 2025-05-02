import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ClaimUrlNotificationProps {
  claimUrl: string;
}

const ClaimUrlNotification: React.FC<ClaimUrlNotificationProps> = ({ claimUrl }) => {
  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-white rounded-lg shadow-lg border border-blue-100 p-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-blue-600" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-gray-900">
            Transfer your Netlify project
          </h3>
          <div className="mt-2 text-sm text-gray-500">
            <p>Click the link below to claim this project on your Netlify account:</p>
            <a
              href={claimUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-blue-600 hover:text-blue-800 break-all"
            >
              {claimUrl}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimUrlNotification;
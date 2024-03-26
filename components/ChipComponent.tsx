import React from 'react';

interface ChipComponentProps {
  head: string;
  content: string;
}

const ChipComponent: React.FC<ChipComponentProps> = ({ head, content }) => {
  return (
    <div className="flex flex-row items-center bg-gray-200 p-2 rounded-lg shadow">
      <div className="font-semibold text-sm text-gray-700">{head}:</div>
      <div className="text-sm text-gray-600 ml-2">{content}</div>
    </div>
  );
};

export default ChipComponent;

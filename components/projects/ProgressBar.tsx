interface Props {
  value: number;
}

export const ProgressBar = ({ value }: Props) => {
  return (
    <div className="w-full bg-gray-200 h-2 rounded">
      <div
        className="bg-blue-500 h-2 rounded transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

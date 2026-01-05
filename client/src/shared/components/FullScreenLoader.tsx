interface FullScreenLoaderProps {
  label?: string;
}

const FullScreenLoader = ({ label }: FullScreenLoaderProps) => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      {label || "Loading..."}
    </div>
  );
};

export default FullScreenLoader;

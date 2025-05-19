import { Outlet } from 'react-router';

export default function App() {
  return (
    <div>
      {/* Global layout like navbar (optional) */}
      <Outlet />
    </div>
  );
}

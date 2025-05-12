import { useNavigate } from 'react-router'

export function Landing() {
  const navigate = useNavigate()

  const onClickLogin = () => navigate('/login');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-white">
      <div className="text-center space-y-6 max-w-md p-8 bg-white shadow-xl rounded-2xl">
        <h1 className="text-4xl font-bold text-indigo-700">Welcome to Blooprint</h1>
        <p className="text-gray-600">Where patients and providers connect.</p>
        <button className="btn btn-primary w-full" onClick={onClickLogin}>
          Sign In
        </button>
      </div>
    </div>
  );
}
